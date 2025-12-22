/**
 * Authentication API Service
 */

import { env } from "@/lib/env";
import type {
  GoogleLoginResponse,
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
} from "@/types/api/user";
import { fetchPublicWithFallback, handleApiResponse } from "./client";

export const authService = {
  /**
   * Login user
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await fetchPublicWithFallback("/api/customer-login", env.apiBaseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...credentials,
        user_type: credentials.user_type || 3,
      }),
    });

    return handleApiResponse<LoginResponse>(response);
  },

  /**
   * Register new user
   */
  signup: async (data: SignupRequest): Promise<SignupResponse> => {
    const response = await fetchPublicWithFallback("/api/customer-signup", env.apiBaseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });

    return handleApiResponse<SignupResponse>(response);
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    const response = await fetchPublicWithFallback("/api/customer-logout", env.apiBaseUrl, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Logout failed");
    }
  },

  /**
   * Google OAuth login/signup
   */
  googleAuth: async (data: {
    email: string;
    name: string;
    googleId: string;
    image?: string;
  }): Promise<GoogleLoginResponse> => {
    const response = await fetchPublicWithFallback("/api/customer-google-login", env.apiBaseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        name: data.name,
        google_id: data.googleId,
        avatar: data.image,
        user_type: 3,
      }),
    });

    return handleApiResponse<GoogleLoginResponse>(response);
  },
};
