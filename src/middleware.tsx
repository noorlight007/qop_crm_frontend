import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { pagesOptions } from "./app/api/auth/[...nextauth]/pages-options";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Check if token or role is missing
    if (!token || !token.role) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(loginUrl);
    }

    const role = token.role as string | undefined;
    const isNetwork = (token as any).is_network as boolean | undefined;

    // Role-based path protection
    if (path.startsWith("/super-admin") && !(role === "SUPER_ADMIN")) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(loginUrl);
    }

    if (
      path.startsWith("/network/director") &&
      !(isNetwork && (role === "DIRECTOR" || role === "COMPLIANCE"))
    ) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(loginUrl);
    }

    if (
      path.startsWith("/network/adviser") &&
      !(isNetwork && role === "ADVISER")
    ) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(loginUrl);
    }

    if (
      path.startsWith("/organisation/director") &&
      !(isNetwork === false && role === "DIRECTOR")
    ) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(loginUrl);
    }

    if (
      path.startsWith("/organisation/adviser") &&
      !(isNetwork === false && role === "ADVISER")
    ) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(loginUrl);
    }
    if (
      path.startsWith("/organisation/admin") &&
      !(isNetwork === false && role === "ADMIN")
    ) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(loginUrl);
    }

    if (path.startsWith("/client") && role !== "CLIENT") {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  },
  {
    pages: {
      ...pagesOptions,
    },
  },
);

export const config = {
  matcher: [
    // "/dashboard/:path*",
    "/super-admin/:path*",
    "/network/director/:path*",
    "/network/adviser/:path*",
    "/organisation/director/:path*",
    "/organisation/adviser/:path*",
    "/organisation/admin/:path*",
    "/client/:path*",
  ],
};
