import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { google } from "googleapis";
import { randomBytes } from "crypto";

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

    // Generate state for OAuth flow
    const state = randomBytes(32).toString("hex");

    // Get base URL from request
    const baseUrl = new URL(request.url).origin;

    // Store state in a cookie (you might want to use a session store instead)
    const response = NextResponse.redirect(
      getAuthUrl(state, session.user.id, baseUrl)
    );

    // Store state in httpOnly cookie
    response.cookies.set("google_calendar_oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600, // 10 minutes
    });

    return response;
  } catch (error: any) {
    console.error("Error initiating OAuth flow:", error);
    return NextResponse.json(
      { error: "Failed to initiate authorization" },
      { status: 500 }
    );
  }
}

function getAuthUrl(state: string, userId: string, baseUrl: string): string {
  const redirectUri = `${baseUrl}/api/google/calendar/callback`;

  // Log the redirect URI for debugging (remove in production if needed)
  console.log("OAuth Redirect URI:", redirectUri);

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectUri
  );

  // Only request calendar.events scope - minimal permission to create Meet links
  // This doesn't grant access to read existing calendar events
  const scopes = [
    "https://www.googleapis.com/auth/calendar.events",
  ];

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    state: `${state}:${userId}`,
    prompt: "consent", // Force consent screen to get refresh token
  });

  return url;
}

