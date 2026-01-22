import { NextRequest, NextResponse } from "next/server";
import client from "@/lib/db";
import { google } from "googleapis";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const code = searchParams.get("code");
        const state = searchParams.get("state");
        const error = searchParams.get("error");

        if (error) {
            return NextResponse.redirect(
                new URL("/home?error=authorization_denied", request.url)
            );
        }

        if (!code || !state) {
            return NextResponse.redirect(
                new URL("/home?error=invalid_request", request.url)
            );
        }

        // Verify state from cookie
        const cookieState = request.cookies.get("google_calendar_oauth_state")?.value;
        if (!cookieState || !state.startsWith(cookieState)) {
            return NextResponse.redirect(
                new URL("/home?error=invalid_state", request.url)
            );
        }

        // Extract userId from state (format: "state:userId")
        const [_, userId] = state.split(":");

        // Get the user's existing Google account
        const account = await client.account.findFirst({
            where: {
                userId: userId,
                providerId: "google",
            },
        });

        if (!account) {
            return NextResponse.redirect(
                new URL("/home?error=account_not_found", request.url)
            );
        }

        // Get base URL from request
        const baseUrl = new URL(request.url).origin;
        const redirectUri = `${baseUrl}/api/google/calendar/callback`;

        // Log the redirect URI for debugging (remove in production if needed)
        console.log("OAuth Callback Redirect URI:", redirectUri);

        // Exchange code for tokens
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            redirectUri
        );

        const { tokens } = await oauth2Client.getToken(code);

        // Update account with new tokens (including calendar.events scope for Meet access)
        await client.account.update({
            where: { id: account.id },
            data: {
                accessToken: tokens.access_token || account.accessToken,
                refreshToken: tokens.refresh_token || account.refreshToken,
                ...(tokens.expiry_date && {
                    accessTokenExpiresAt: new Date(tokens.expiry_date),
                }),
                scope: tokens.scope || account.scope,
            },
        });

        // Clear the state cookie
        const response = NextResponse.redirect(
            new URL("/home?authorized=true", request.url)
        );
        response.cookies.delete("google_calendar_oauth_state");

        return response;
    } catch (error: any) {
        console.error("Error in OAuth callback:", error);
        return NextResponse.redirect(
            new URL("/home?error=callback_failed", request.url)
        );
    }
}

