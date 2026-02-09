import apiClient from "@/services/api-client";
import formatChoiceFieldValue from "@/utils/formatters";
import { NextAuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Extend NextAuth's user type to include the JWT token
interface UserWithToken extends NextAuthUser {
  accessToken?: string;
  refreshToken?: string;
  user_type?: string;
  profile_image?: string | null;
  subdomain?: string | null;
}

// TypeScript Declaration Module for Custom Session and User Properties
declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      user_type?: string | null;
      profile_image?: string | null;
      subdomain?: string | null;
      accessToken?: string;
      refreshToken?: string;
    };
  }

  interface User {
    accessToken?: string;
    refreshToken?: string;
    user_type?: string;
    profile_image?: string | null;
  }

  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    user_type?: string;
    profile_image?: string | null;
    name?: string;
    subdomain?: string | null;
    accessTokenExpires?: number;
  }

  // Extend core auth options to support trustHost
  interface AuthOptions {
    trustHost?: boolean;
  }
}

// Helper function to refresh access token
async function refreshAccessToken(token: any) {
  try {
    if (!token.refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await apiClient.post(
      "/auth/jwt/refresh/",
      {
        refresh: token.refreshToken,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-TENANT-SUBDOMAIN": token.subdomain || "",
        },
      },
    );

    if (!response.data) {
      throw new Error("Failed to refresh token");
    }

    return {
      ...token,
      accessToken: response.data.access,
      accessTokenExpires: Date.now() + 5 * 60 * 1000, // 5 minutes from now
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authoption: NextAuthOptions = {
  session: {
    strategy: "jwt",
    // Match backend refresh token expiry (1 day)
    maxAge: 24 * 60 * 60, // 1 day (matches backend refresh token expiry)
    updateAge: 60 * 60, // re-issue session cookie once per hour while active
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/login",
  },
  trustHost: true,
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        // Match session duration (1 day to align with backend refresh token)
        maxAge: 24 * 60 * 60, // 1 day
        // Extract base domain for subdomain support
        // If you're on app.example.com, this sets .example.com
        domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN || undefined,
      },
    },
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        userAgent: { label: "User Agent", type: "text" },
        subdomain: { label: "Subdomain", type: "text" },
      },
      async authorize(credentials) {
        try {
          if (!credentials) {
            throw new Error("No credentials provided");
          }

          const result = await apiClient.post(
            "/auth/jwt/create/",
            {
              email: credentials.email,
              password: credentials.password,
            },
            {
              headers: {
                "Content-Type": "application/json",
                "X-Device-Info": credentials.userAgent || "",
                "X-TENANT-SUBDOMAIN": credentials.subdomain || "",
              },
            },
          );

          const profileResponse = result?.data?.access
            ? await apiClient.get("/auth/user-profile/", {
                headers: {
                  Authorization: `JWT ${result.data.access}`,
                  "Content-Type": "application/json",
                  "X-TENANT-SUBDOMAIN": credentials.subdomain || "",
                },
              })
            : null;

          if (profileResponse?.data) {
            const userData = profileResponse.data || {};
            const fullName = `${
              userData.title ? formatChoiceFieldValue(userData.title) + " " : ""
            }${userData.first_name || ""}${
              userData.middle_name ? " " + userData.middle_name : ""
            }${userData.last_name ? " " + userData.last_name : ""}`.trim();

            return {
              id: profileResponse.data.user_id || "default_id",
              name: fullName || credentials.email,
              email: credentials.email,
              user_type: userData.user_type || "",
              profile_image: userData.profile_image || null,
              subdomain: credentials.subdomain || null,
              accessToken: result.data.access,
              refreshToken: result.data.refresh,
            };
          }
          return null;
        } catch (error) {
          throw new Error("Invalid email or password.");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        const userWithToken = user as UserWithToken;
        token.name = userWithToken.name;
        if (userWithToken.accessToken) {
          token.accessToken = userWithToken.accessToken;
          // Set access token expiry time (5 minutes from now as buffer)
          token.accessTokenExpires = Date.now() + 5 * 60 * 1000;
        }
        if (userWithToken.refreshToken) {
          token.refreshToken = userWithToken.refreshToken;
        }
        if (userWithToken.user_type) {
          token.user_type = userWithToken.user_type;
        }
        if (userWithToken.profile_image) {
          token.profile_image = userWithToken.profile_image;
        }
        if (userWithToken.subdomain) {
          token.subdomain = userWithToken.subdomain;
        }
        return token;
      }

      // Return previous token if the access token has not expired yet
      if (
        token.accessTokenExpires &&
        Date.now() < (token.accessTokenExpires as number)
      ) {
        // Handle session updates (when update() is called)
        if (trigger === "update" && session) {
          if (session.name) {
            token.name = session.name;
          }
          if (session.profile_image !== undefined) {
            token.profile_image = session.profile_image;
          }
          if (session.user_type !== undefined) {
            token.user_type = session.user_type;
          }
          if (session.subdomain !== undefined) {
            token.subdomain = session.subdomain;
          }
        }
        return token;
      }

      // Access token has expired, try to refresh it
      const refreshedToken = await refreshAccessToken(token);

      // Handle session updates after refresh
      if (trigger === "update" && session) {
        if (session.name) {
          refreshedToken.name = session.name;
        }
        if (session.profile_image !== undefined) {
          refreshedToken.profile_image = session.profile_image;
        }
        if (session.user_type !== undefined) {
          refreshedToken.user_type = session.user_type;
        }
        if (session.subdomain !== undefined) {
          refreshedToken.subdomain = session.subdomain;
        }
      }

      return refreshedToken;
    },

    async session({ session, token }) {
      session.user = {
        ...session.user,
        name: token.name as string | undefined,
        accessToken: token.accessToken as string | undefined,
        refreshToken: token.refreshToken as string | undefined,
        user_type: token.user_type as string | undefined,
        profile_image: token.profile_image as string | null | undefined,
        subdomain: token.subdomain as string | null | undefined,
      };
      return session;
    },

    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  debug: true,
};
