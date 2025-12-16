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
    const response = await fetchPublicWithFallback("/api/division", env.apiBaseUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    const data = await handleApiResponse<DivisionsResponse>(response);
    const rawArray = Array.isArray(data) ? data : [];
    // Transform API response format (division_id, division_name) to expected format (id, name)
    return rawArray
      .map(
        (item: { division_id?: number; id?: number; division_name?: string; name?: string }) => ({
          id: item.division_id ?? item.id,
          name: item.division_name ?? item.name,
        })
      )
      .filter((item) => item.id !== null && item.id !== undefined && item.name);
  },

  /**
   * Get areas by division ID
   */
  getAreas: async (divisionId: number, signal?: AbortSignal): Promise<AreasResponse> => {
    const response = await fetchPublicWithFallback(`/api/area/${divisionId}`, env.apiBaseUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal,
    });

    const data = await handleApiResponse<AreasResponse>(response);
    const rawArray = Array.isArray(data) ? data : [];
    // Transform API response format (area_id, area_name) to expected format (id, name)
    return rawArray
      .map((item: { area_id?: number; id?: number; area_name?: string; name?: string }) => ({
        id: item.area_id ?? item.id,
        name: item.area_name ?? item.name,
      }))
      .filter((item) => item.id !== null && item.id !== undefined && item.name);
  },
};
