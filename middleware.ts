import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/admin"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );

  if (isProtectedRoute) {
    const token = request.cookies.get("admin_jwt_token")?.value;

    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirectPath", path);
      return NextResponse.redirect(loginUrl);
    }

    try {
      return NextResponse.next();
    } catch (error) {
      console.error("JWT verification failed:", error);
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirectPath", path);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*","/admin"],
};
