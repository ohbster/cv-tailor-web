export { default } from "next-auth/middleware";

// Protect these routes - require authentication
export const config = {
  matcher: [
    "/profile/:path*",
    "/candidates/:path*",
    "/resumes/:path*",
    "/dashboard/:path*",
  ],
};
