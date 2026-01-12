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

    // Extract subdomain from current URL
    const hostname = req.headers.get("host") || req.nextUrl.hostname;
    let currentSubdomain = "";

    // Remove port number if present
    const hostnameWithoutPort = hostname.split(":")[0];

    if (
      hostnameWithoutPort === "localhost" ||
      hostnameWithoutPort === "127.0.0.1"
    ) {
      currentSubdomain = process.env.NEXT_PUBLIC_LOCAL_SUBDOMAIN || "test-plus";
    } else {
      const parts = hostnameWithoutPort.split(".");
      if (parts.length >= 3) {
        // For domains like test-org.qopcrm.com
        const subdomain = parts[0];
        if (subdomain && subdomain !== "www") {
          currentSubdomain = subdomain;
        }
      } else if (parts.length === 2) {
        // For cases like qopcrm.com without subdomain, use a default
        currentSubdomain = "www";
      }
    }

    // Validate subdomain matches the one stored in session
    if (
      currentSubdomain &&
      token.subdomain &&
      token.subdomain !== currentSubdomain
    ) {
      // Redirect to logout to clear session, then back to login
      const logoutUrl = new URL("/logout", req.url);
      logoutUrl.searchParams.set("callbackUrl", "/auth/login");
      logoutUrl.searchParams.set("error", "subdomain_mismatch");
      return NextResponse.redirect(logoutUrl);
    }

    // Role-based path protection
    if (path.startsWith("/dashboard/admin") && token.user_type !== "ADMIN") {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(loginUrl);
    }

    if (
      path.startsWith("/dashboard/network/director") &&
      !["NETWORK_DIRECTOR", "NETWORK_COMPLIANCE_ASSISTANT"].includes(
        token.user_type as string
      )
    ) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(loginUrl);
    }

    if (
      path.startsWith("/dashboard/network/adviser") &&
      token.user_type !== "NETWORK_ADVISER"
    ) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(loginUrl);
    }

    if (
      path.startsWith("/dashboard/organisation/director") &&
      token.user_type !== "ORGANISATION_DIRECTOR"
    ) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(loginUrl);
    }

    if (
      path.startsWith("/dashboard/organisation/adviser") &&
      token.user_type !== "ORGANISATION_ADVISER"
    ) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(loginUrl);
    }
    if (
      path.startsWith("/dashboard/organisation/admin") &&
      token.user_type !== "ORGANISATION_ADMIN"
    ) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(loginUrl);
    }

    if (path.startsWith("/dashboard/client") && token.user_type !== "CLIENT") {
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
    "/dashboard/network/director/:path*",
    "/dashboard/network/adviser/:path*",
    "/dashboard/organisation/director/:path*",
    "/dashboard/organisation/adviser/:path*",
    "/dashboard/organisation/admin/:path*",
    "/dashboard/client/:path*",
  ],
};
