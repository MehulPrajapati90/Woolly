import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import client from "@/lib/db";
import { google } from "googleapis";

export async function GET(request: NextRequest) {
    try {
        // Get the current session
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Get the user's Google account with access token
        const account = await client.account.findFirst({
            where: {
                userId: session.user.id,
                providerId: "google",
            },
        });

        if (!account || !account.accessToken) {
            return NextResponse.json(
                { error: "Google account not connected. Please sign in with Google first." },
                { status: 400 }
            );
        }

        // Check if user has calendar.events permission (for creating Meet links)
        const hasMeetScope = account.scope?.includes("calendar.events") ||
            account.scope?.includes("https://www.googleapis.com/auth/calendar.events");

        if (!hasMeetScope) {
            // Return a special response indicating authorization is needed
            return NextResponse.json(
                {
                    error: "Google Meet access required",
                    requiresAuth: true,
                    authUrl: "/api/google/calendar/authorize"
                },
                { status: 403 }
            );
        }

        // Initialize Google OAuth2 client
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET
        );

        // Set the credentials
        oauth2Client.setCredentials({
            access_token: account.accessToken,
            refresh_token: account.refreshToken || undefined,
        });

        // Handle token refresh automatically
        oauth2Client.on("tokens", async (tokens) => {
            if (tokens.access_token) {
                // Update the access token in the database
                await client.account.update({
                    where: { id: account.id },
                    data: {
                        accessToken: tokens.access_token,
                        ...(tokens.refresh_token && { refreshToken: tokens.refresh_token }),
                        ...(tokens.expiry_date && {
                            accessTokenExpiresAt: new Date(tokens.expiry_date),
                        }),
                    },
                });
            }
        });

        // Initialize Google Calendar API
        const calendar = google.calendar({ version: "v3", auth: oauth2Client });

        // Create a calendar event with Google Meet
        const event = {
            summary: "Woolly Meeting",
            description: "Meeting created via Woolly",
            start: {
                dateTime: new Date().toISOString(),
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
            end: {
                dateTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour from now
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
            conferenceData: {
                createRequest: {
                    requestId: `woolly-${Date.now()}`,
                    conferenceSolutionKey: {
                        type: "hangoutsMeet",
                    },
                },
            },
        };

        // Insert the event to generate Meet link
        const response = await calendar.events.insert({
            calendarId: "primary",
            requestBody: event,
            conferenceDataVersion: 1,
        });

        const meetLink = response.data.conferenceData?.entryPoints?.find(
            (entry) => entry.entryPointType === "video"
        )?.uri;

        if (!meetLink) {
            return NextResponse.json(
                { error: "Failed to create Google Meet link" },
                { status: 500 }
            );
        }

        // Delete the calendar event immediately - we only needed it to generate the Meet link
        if (response.data.id) {
            try {
                await calendar.events.delete({
                    calendarId: "primary",
                    eventId: response.data.id,
                });
            } catch (deleteError) {
                // Log but don't fail - we already have the Meet link
                console.error("Failed to delete temporary calendar event:", deleteError);
            }
        }

        return NextResponse.json({
            meetLink,
        });
    } catch (error: any) {
        console.error("Error creating Google Calendar event:", error);

        // Handle token refresh if needed
        if (error.code === 401 || error.message?.includes("Invalid Credentials")) {
            return NextResponse.json(
                { error: "Google authentication expired. Please sign in again." },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: error.message || "Failed to create Google Meet link" },
            { status: 500 }
        );
    }
}

