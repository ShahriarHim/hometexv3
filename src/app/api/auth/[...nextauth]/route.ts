import { authService } from "@/services/api";
import type { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const response = await authService.login({
            email: credentials.email,
            password: credentials.password,
          });

          if (response.success && response.data && response.data.length > 0) {
            const userData = response.data[0];
            return {
              id: userData.id.toString(),
              email: userData.email,
              name: userData.name,
              token: userData.token,
            };
          }
          return null;
        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle Google OAuth sign in
      if (account?.provider === "google" && user) {
        try {
          // eslint-disable-next-line no-console
          console.log("[NextAuth signIn] Google OAuth detected, calling backend...", {
            email: user.email,
            name: user.name,
          });

          // Try to register/login the user with the backend
          const profileData = profile as unknown as Record<string, unknown>;
          const picture =
            typeof profileData?.picture === "string" ? profileData.picture : undefined;
          const response = await authService.googleAuth({
            email: user.email || "",
            name: user.name || "",
            googleId: user.id,
            image: picture,
          });

          // eslint-disable-next-line no-console
          console.log("[NextAuth signIn] Backend response received:", {
            hasSuccess: !!response.success,
            hasToken: !!(response as unknown as Record<string, unknown>).token,
            hasUser: !!(response as unknown as Record<string, unknown>).user,
            tokenType: (response as unknown as Record<string, unknown>).token
              ? typeof (response as unknown as Record<string, unknown>).token
              : "none",
            tokenLength:
              ((response as unknown as Record<string, unknown>).token as string)?.length || 0,
            tokenPreview: (
              (response as unknown as Record<string, unknown>).token as string
            )?.substring(0, 15),
          });

          if (
            (response as unknown as Record<string, unknown>).success &&
            (response as unknown as Record<string, unknown>).token &&
            (response as unknown as Record<string, unknown>).user
          ) {
            // Store token in user object for JWT callback
            const userWithToken = user as unknown as Record<string, unknown>;
            userWithToken.token = (response as unknown as Record<string, unknown>).token;
            userWithToken.backendId = (
              (response as unknown as Record<string, unknown>).user as Record<string, unknown>
            ).id;
            // eslint-disable-next-line no-console
            console.log("[NextAuth signIn] Token stored in user object", {
              tokenLength: (userWithToken.token as string).length,
              backendId: userWithToken.backendId,
            });
            return true;
          }

          console.warn("[NextAuth signIn] Backend response missing required fields");
          return true; // Allow sign in even if backend sync fails
        } catch (error) {
          console.error("[NextAuth signIn] Backend error:", error);
          return true; // Allow sign in
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        const userWithToken = user as unknown as Record<string, unknown>;
        if (account.provider === "google") {
          const backendToken = userWithToken.token as string | undefined;
          const googleToken = account.access_token as string | undefined;

          // eslint-disable-next-line no-console
          console.log("[NextAuth jwt] Processing Google login:", {
            hasBackendToken: !!backendToken,
            backendTokenLength: backendToken?.length || 0,
            backendTokenPreview: backendToken?.substring(0, 15),
            hasGoogleToken: !!googleToken,
            googleTokenLength: googleToken?.length || 0,
            usingToken: backendToken ? "backend" : "google",
          });

          // For Google login, store the backend token from our API
          token.accessToken = backendToken || googleToken;
          token.provider = "google";
          token.backendId = userWithToken.backendId as string | undefined;
          token.backendToken = backendToken; // Backend JWT token
        } else if (account.provider === "credentials") {
          // For credentials login, store the token from your backend
          token.accessToken = userWithToken.token as string;
          token.backendToken = userWithToken.token as string;
          token.provider = "credentials";
        }
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const sessionWithToken = session as unknown as Record<string, unknown>;
        sessionWithToken.accessToken = token.accessToken;
        sessionWithToken.backendToken = token.backendToken; // Add backend token to session
        sessionWithToken.provider = token.provider;
        sessionWithToken.backendId = token.backendId;

        // eslint-disable-next-line no-console
        console.log("[NextAuth session] Session updated:", {
          provider: token.provider,
          hasAccessToken: !!sessionWithToken.accessToken,
          accessTokenLength: (sessionWithToken.accessToken as string)?.length || 0,
          accessTokenPreview: (sessionWithToken.accessToken as string)?.substring(0, 15),
          hasBackendToken: !!sessionWithToken.backendToken,
          backendTokenLength: (sessionWithToken.backendToken as string)?.length || 0,
          backendTokenPreview: (sessionWithToken.backendToken as string)?.substring(0, 15),
        });
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
