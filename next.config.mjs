/** @type {import('next').NextConfig} */
const nextConfig = {
  // The catalog filename is resolved through a lookup table
  // (src/lib/wholesale-orders/catalog.ts), not a static string literal, so
  // Vercel's build-time file tracing can't discover /data/*.json on its own —
  // list it explicitly or the deployed function 404s reading the file.
  experimental: {
    outputFileTracingIncludes: {
      "/api/wholesale-orders/read": ["./data/**/*"],
    },
  },
};

export default nextConfig;
