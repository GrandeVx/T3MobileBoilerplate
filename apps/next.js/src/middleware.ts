import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient({ req, res });

  // Refresh session if expired - required for Server Components
  const { data } = await supabase.auth.getSession();

  if (!data.session && !req.url.includes("auth")) {
    return NextResponse.rewrite(new URL("/login", req.url));
  } else {
    if (req.url.includes("auth")) {
      NextResponse.next();
    } else if (!req.url.includes("/dashboard")) {
      // se l'url è uguale al dominio, reindirizza alla dashboard
      return NextResponse.rewrite(new URL("/dashboard/home", req.url));
    }
    return NextResponse.next();
  }
}
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/trpc (trpc API calls)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|api/trpc|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
