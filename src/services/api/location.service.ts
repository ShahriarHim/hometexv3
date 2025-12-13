/**
 * Location API Service
 */

import { env } from "@/lib/env";
import type { AreasResponse, DivisionsResponse } from "@/types/api/location";
import { fetchPublicWithFallback, handleApiResponse } from "./client";

export const locationService = {
  /**
   * Get all divisions
   */
  getDivisions: async (): Promise<DivisionsResponse> => {
    const response = await fetchPublicWithFallback("/api/divisions", env.apiBaseUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    const data = await handleApiResponse<DivisionsResponse>(response);
    return Array.isArray(data) ? data : [];
  },

  /**
   * Get areas by division ID
   */
  getAreas: async (divisionId: number): Promise<AreasResponse> => {
    const response = await fetchPublicWithFallback(`/api/area/${divisionId}`, env.apiBaseUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    const data = await handleApiResponse<AreasResponse>(response);
    return Array.isArray(data) ? data : [];
  },
};
