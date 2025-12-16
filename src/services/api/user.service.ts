/**
 * User Profile API Service
 */

import { env } from "@/lib/env";
import type { ProfileResponse, UserProfile } from "@/types/api/user";
import { fetchWithFallback, handleApiResponse } from "./client";

export const userService = {
  /**
   * Get current user profile
   */
  getProfile: async (): Promise<ProfileResponse> => {
    const response = await fetchWithFallback("/api/my-profile", env.apiBaseUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    return handleApiResponse<ProfileResponse>(response);
  },

  /**
   * Update user profile
   */
  updateProfile: async (profileData: Partial<UserProfile>): Promise<ProfileResponse> => {
    const response = await fetchWithFallback("/api/update-profile", env.apiBaseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    });

    return handleApiResponse<ProfileResponse>(response);
  },
};
