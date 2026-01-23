import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { pagesOptions } from "./app/api/auth/[...nextauth]/pages-options";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Check if token or user_type is missing
    if (!token || !token.user_type) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(loginUrl);
    }

    // Role-based path protection
    if (path.startsWith("/admin") && token.user_type !== "ADMIN") {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(loginUrl);
    }

    if (
      path.startsWith("/network/director") &&
      !["NETWORK_DIRECTOR", "NETWORK_COMPLIANCE_ASSISTANT"].includes(
        token.user_type as string
      )
    ) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(loginUrl);
    }

    if (
      path.startsWith("/network/adviser") &&
      token.user_type !== "NETWORK_ADVISER"
    ) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(loginUrl);
    }

    if (
      path.startsWith("/organisation/director") &&
      token.user_type !== "ORGANISATION_DIRECTOR"
    ) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(loginUrl);
    }

    if (
      path.startsWith("/organisation/adviser") &&
      token.user_type !== "ORGANISATION_ADVISER"
    ) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(loginUrl);
    }
    if (
      path.startsWith("/organisation/admin") &&
      token.user_type !== "ORGANISATION_ADMIN"
    ) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(loginUrl);
    }

    if (path.startsWith("/client") && token.user_type !== "CLIENT") {
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
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/network/director/:path*",
    "/network/adviser/:path*",
    "/organisation/director/:path*",
    "/organisation/adviser/:path*",
    "/organisation/admin/:path*",
    "/client/:path*",
  ],
};
