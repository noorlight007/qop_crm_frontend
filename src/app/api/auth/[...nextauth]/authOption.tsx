import apiClient from "@/services/api-client";
import formatChoiceFieldValue from "@/utils/formatters";
import { NextAuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Extend NextAuth's user type to include the JWT token
interface UserWithToken extends NextAuthUser {
  accessToken?: string;
  refreshToken?: string;
  profile_image?: string | null;
  is_network?: boolean;
  role?: string;
  subdomain?: string | null;
}

// TypeScript Declaration Module for Custom Session and User Properties
declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      profile_image?: string | null;
      is_network?: boolean;
      subdomain?: string | null;
      accessToken?: string;
      refreshToken?: string;
      role?: string;
    };
  }

  interface User {
    accessToken?: string;
    refreshToken?: string;
    profile_image?: string | null;
    is_network?: boolean;
    role?: string;
  }

  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    profile_image?: string | null;
    name?: string;
    subdomain?: string | null;
    is_network?: boolean;
    role?: string;
  }

  // Extend core auth options to support trustHost
  interface AuthOptions {
    trustHost?: boolean;
  }
}

export const authoption: NextAuthOptions = {
  session: {
    strategy: "jwt",
    // Auto logout after 12 hours.
    // NOTE: access tokens may still be short-lived; API layer refreshes them on 401.
    maxAge: 12 * 60 * 60, // 12 hours
    updateAge: 60 * 60, // re-issue session cookie at most once/hour while active
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
          // console.log("TEST::", result.data);

          const profileResponse = result?.data?.access
            ? await apiClient.get("/auth/user-profile/", {
                headers: {
                  Authorization: `JWT ${result.data.access}`,
                  "Content-Type": "application/json",
                  "X-TENANT-SUBDOMAIN": credentials.subdomain || "",
                },
              })
            : null;
          // console.log("Profile::", profileResponse?.data);

          if (profileResponse?.data) {
            const userData = profileResponse.data || {};
            const fullName = `${
              userData.title ? formatChoiceFieldValue(userData.title) + " " : ""
            }${userData.first_name || ""}${
              userData.middle_name ? " " + userData.middle_name : ""
            }${userData.last_name ? " " + userData.last_name : ""}`.trim();

            return {
              id: userData.id || "default_id",
              name: fullName || credentials.email,
              email: credentials.email,
              profile_image: userData.profile_image || null,
              is_network: userData.is_network || false,
              subdomain: credentials.subdomain || null,
              role: result.data.role || "",
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

        token.id = userWithToken.id;
        token.name = userWithToken.name;
        if (userWithToken.accessToken) {
          token.accessToken = userWithToken.accessToken;
        }
        if (userWithToken.refreshToken) {
          token.refreshToken = userWithToken.refreshToken;
        }
        if (userWithToken.profile_image) {
          token.profile_image = userWithToken.profile_image;
        }
        if (userWithToken.subdomain) {
          token.subdomain = userWithToken.subdomain;
        }
        if (userWithToken.is_network !== undefined) {
          token.is_network = userWithToken.is_network;
        }
        if (userWithToken.role) {
          token.role = userWithToken.role;
        }
      }

      // Handle session updates (when update() is called)
      if (trigger === "update" && session) {
        if (session.name) {
          token.name = session.name;
        }
        if (session.accessToken !== undefined) {
          token.accessToken = session.accessToken;
        }
        if (session.refreshToken !== undefined) {
          token.refreshToken = session.refreshToken;
        }
        if (session.profile_image !== undefined) {
          token.profile_image = session.profile_image;
        }
        if (session.subdomain !== undefined) {
          token.subdomain = session.subdomain;
        }
        if (session.is_network !== undefined) {
          token.is_network = session.is_network;
        }
        if (session.role !== undefined) {
          token.role = session.role;
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id as number,
        name: token.name as string | undefined,
        accessToken: token.accessToken as string | undefined,
        refreshToken: token.refreshToken as string | undefined,
        profile_image: token.profile_image as string | null | undefined,
        subdomain: token.subdomain as string | null | undefined,
        is_network: token.is_network as boolean | undefined,
        role: token.role as string | undefined,
      };
      return session;
    },

    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  debug: true,
};
