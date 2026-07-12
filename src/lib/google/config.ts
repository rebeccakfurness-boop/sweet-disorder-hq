// Central place for Google OAuth env vars. Every other file under
// `src/lib/google` reads config through here rather than `process.env`
// directly, so there's one place to check when credentials are missing.
export const googleConfig = {
  clientId: process.env.GOOGLE_CLIENT_ID ?? "",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
  redirectUri: process.env.GOOGLE_REDIRECT_URI ?? "",
  // drive.readonly is enough to browse + read metadata/content; add
  // drive.metadata.readonly-only scopes here later if a tighter grant is
  // preferred once real usage patterns are known.
  scopes: [
    "https://www.googleapis.com/auth/drive.readonly",
    "https://www.googleapis.com/auth/userinfo.email",
  ],
};

export function isGoogleDriveConfigured(): boolean {
  return Boolean(googleConfig.clientId && googleConfig.clientSecret && googleConfig.redirectUri);
}
