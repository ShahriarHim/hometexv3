import { DefaultSession, DefaultUser } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    backendToken?: string;
    accessToken?: string;
    provider?: string;
    backendId?: string;
    user: {
      id?: string;
      image?: string | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    backendToken?: string;
    token?: string;
    backendId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    backendToken?: string;
    accessToken?: string;
    provider?: string;
    backendId?: string;
  }
}
