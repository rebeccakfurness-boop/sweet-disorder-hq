import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

import { isGoogleDriveConfigured } from "@/lib/google/config";
import { getGoogleAuthUrl } from "@/lib/google/oauth";

const STATE_COOKIE = "google_oauth_state";

/** Step 1 of connecting Google Drive: redirect to Google's consent screen. */
export async function GET() {
  if (!isGoogleDriveConfigured()) {
    return NextResponse.json(
      {
        configured: false,
        message:
          "Google OAuth is not configured. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REDIRECT_URI to enable this.",
      },
      { status: 503 }
    );
  }

  const state = randomUUID();
  const response = NextResponse.redirect(getGoogleAuthUrl(state));
  response.cookies.set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });
  return response;
}
