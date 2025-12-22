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

          if (response.success && response.token && response.user) {
            // Store token in user object for JWT callback
            const userWithToken = user as unknown as Record<string, unknown>;
            userWithToken.token = response.token;
            userWithToken.backendId = response.user.id;
            return true;
          }
          return true; // Allow sign in even if backend sync fails
        } catch (error) {
          console.error("Google auth backend error:", error);
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
          // For Google login, store the backend token from our API
          token.accessToken = (userWithToken.token as string) || account.access_token;
          token.provider = "google";
          token.backendId = userWithToken.backendId as string | undefined;
          token.backendToken = userWithToken.token as string; // Backend JWT token
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
