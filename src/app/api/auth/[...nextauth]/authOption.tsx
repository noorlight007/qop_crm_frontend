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
    user_type?: string;
    profile_image?: string | null;
    name?: string;
  }

  // Extend core auth options to support trustHost
  interface AuthOptions {
    trustHost?: boolean;
  }
}

export const authoption: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 12 * 60 * 60, // 12 hours
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
              },
            }
          );

          const profileResponse = result?.data?.access
            ? await apiClient.get("/auth/user-profile/", {
                headers: {
                  Authorization: `JWT ${result.data.access}`,
                  "Content-Type": "application/json",
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
      if (user) {
        const userWithToken = user as UserWithToken;
        token.name = userWithToken.name;
        if (userWithToken.accessToken) {
          token.accessToken = userWithToken.accessToken;
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
      }

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
      }

      return token;
    },

    async session({ session, token }) {
      session.user = {
        ...session.user,
        name: token.name as string | undefined,
        accessToken: token.accessToken as string | undefined,
        refreshToken: token.refreshToken as string | undefined,
        user_type: token.user_type as string | undefined,
        profile_image: token.profile_image as string | null | undefined,
      };
      return session;
    },

    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  debug: true,
};
