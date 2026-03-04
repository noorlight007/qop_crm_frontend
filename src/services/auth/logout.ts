import { getSession, signOut } from "next-auth/react";

const clearAuthCookies = () => {
  if (typeof window === "undefined") return;

  const hostname = window.location.hostname;
  const inferredBaseDomain = hostname.split(".").slice(-2).join(".");
  const configuredDomain = process.env.NEXT_PUBLIC_COOKIE_DOMAIN;

  const domainCandidates = new Set<string>();
  domainCandidates.add(hostname);
  if (inferredBaseDomain) domainCandidates.add(`.${inferredBaseDomain}`);
  if (configuredDomain) {
    domainCandidates.add(
      configuredDomain.startsWith(".")
        ? configuredDomain
        : `.${configuredDomain}`,
    );
  }

  const cookiesToClear = [
    "next-auth.session-token",
    "__Secure-next-auth.session-token",
    "next-auth.csrf-token",
    "__Host-next-auth.csrf-token",
    "next-auth.callback-url",
    "__Secure-next-auth.callback-url",
    "next-auth.pkce.code_verifier",
    "next-auth.state",
    "next-auth.nonce",
  ];

  cookiesToClear.forEach((cookieName) => {
    document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;

    domainCandidates.forEach((domain) => {
      document.cookie = `${cookieName}=; path=/; domain=${domain}; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
    });
  });
};

export const logOut = async () => {
  let accessToken: string | null = null;
  let refreshToken: string | null = null;

  if (typeof window !== "undefined") {
    try {
      accessToken = localStorage.getItem("token");
      refreshToken = localStorage.getItem("refreshToken");
    } catch (e) {
      console.error("Error reading localStorage during logout", e);
    }
  } else {
    try {
      const session = await getSession();
      accessToken = session?.user?.accessToken ?? null;
      refreshToken = session?.user?.refreshToken ?? null;
    } catch (e) {
      console.error("Error reading session during logout", e);
    }
  }

  if (refreshToken) {
    try {
      const formData = new FormData();
      formData.append("refresh", refreshToken);

      const headers: Record<string, string> = {};
      if (accessToken) headers.Authorization = `JWT ${accessToken}`;

      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout/`, {
        method: "POST",
        headers,
        body: formData,
      }).catch((error) => {
        console.error("Logout API call failed:", error);
      });
    } catch (e) {
      console.error("Error calling logout API", e);
    }
  }

  // Clear HttpOnly NextAuth cookies first (server-side) via NextAuth endpoint.
  // Important: `signOut()` relies on NextAuth CSRF cookie.
  try {
    if (typeof window !== "undefined") {
      await signOut({ redirect: false });
    }
  } catch (e) {
    console.error("Error during signOut", e);
  }

  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      sessionStorage.clear();

      clearAuthCookies();
    } catch (e) {
      console.error("Error clearing storage/cookies during logout", e);
    }

    window.location.href = `${window.location.origin}/auth/login`;
  }
};
