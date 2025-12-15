import apiClient from "@/services/api-client";
import formatChoiceFieldValue from "@/utils/formatters";
import { NextAuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Extend NextAuth's user type to include the JWT token
interface UserWithToken extends NextAuthUser {
  token?: string;
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
    };
  }

  interface User {
    accessToken?: string;
    user_type?: string;
    profile_image?: string | null;
  }

  interface JWT {
    accessToken?: string;
    user_type?: string;
    profile_image?: string | null;
    name?: string;
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

          const response = await apiClient.post(
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

          if (response.data?.access) {
            return {
              id: response.data.user_id || "default_id",
              name:
                `${
                  response.data.user.title
                    ? formatChoiceFieldValue(response.data.user.title) + " "
                    : ""
                }${response.data.user.first_name || ""}${
                  response.data.user.middle_name
                    ? " " + response.data.user.middle_name
                    : ""
                }${
                  response.data.user.last_name
                    ? " " + response.data.user.last_name
                    : ""
                }`.trim() || credentials.email,
              email: credentials.email,
              user_type: response.data.user.user_type || "",
              profile_image: response.data.user.profile_image || null,
              token: response.data.access,
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
        if (userWithToken.token) {
          token.accessToken = userWithToken.token;
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
        console.log("Session update triggered:", session);
        if (session.name) {
          token.name = session.name;
        }
        if (session.profile_image !== undefined) {
          token.profile_image = session.profile_image;
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.user = {
        ...session.user,
        name: token.name as string | undefined,
        accessToken: token.accessToken as string | undefined,
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
