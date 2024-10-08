import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Allow unrestricted access to auth API endpoints
  if (req.nextUrl.pathname.startsWith("/api/auth")) {
    return res;
  }

  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient({ req, res });

  // Refresh session if expired - required for Server Components
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  // Check if the request is for a public route
  const isPublicRoute = ["/login", "/signup", "/forgot-password"].some(
    (route) => req.nextUrl.pathname.startsWith(route),
  );

  if (!session && !isPublicRoute) {
    // Redirect to login if not authenticated and trying to access a protected route
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (session && isPublicRoute) {
    // Redirect to dashboard if authenticated and trying to access a public route
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Handle any errors from getSession
  if (error) {
    console.error("Auth error:", error);
    // Optionally, you could redirect to an error page or clear the session
    // return NextResponse.redirect(new URL('/error', req.url));
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/trpc (trpc API calls)
     * - public file extensions (.svg, .png, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|api/trpc|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
