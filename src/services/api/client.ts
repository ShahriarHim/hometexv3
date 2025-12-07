/**
 * API Client - Core HTTP client with authentication and fallback logic
 * Follows Next.js best practices for data fetching
 */

import { env } from "@/lib/env";

/**
 * Get authentication token from localStorage
 */
export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("hometex-auth-token");
  }
  return null;
};

/**
 * Make authenticated API requests with Bearer token
 */
export const authenticatedFetch = (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = getAuthToken();
  const headers = {
    ...options.headers,
    "Content-Type": "application/json",
  };

  if (token) {
    Object.assign(headers, { Authorization: `Bearer ${token}` });
  }

  return fetch(url, {
    ...options,
    headers,
  });
};

/**
 * Fetch with localhost fallback for authenticated requests
 * Tries localhost first, then falls back to production
 */
export const fetchWithFallback = async (
  endpoint: string,
  productionBaseUrl: string,
  options: RequestInit = {}
): Promise<Response> => {
  const localhostUrl = `${env.apiLocalUrl}${endpoint}`;
  const productionUrl = `${productionBaseUrl}${endpoint}`;

  try {
    // Try localhost first with a short timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const localResponse = await authenticatedFetch(localhostUrl, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (localResponse.ok) {
      return localResponse;
    }
  } catch (error) {
    // Network error, timeout, or CORS issue - try production
    if (error instanceof Error && error.name !== "AbortError") {
      if (process.env.NODE_ENV === "development") {
        console.error("Localhost request failed, trying production:", error.message);
      }
    }
  }

  // Fallback to production
  return authenticatedFetch(productionUrl, options);
};

/**
 * Fetch with localhost fallback for public requests (no authentication)
 */
export const fetchPublicWithFallback = async (
  endpoint: string,
  productionBaseUrl: string,
  options: RequestInit = {}
): Promise<Response> => {
  const localhostUrl = `${env.apiLocalUrl}${endpoint}`;
  const productionUrl = `${productionBaseUrl}${endpoint}`;

  try {
    // Try localhost first with a short timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const localResponse = await fetch(localhostUrl, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (localResponse.ok) {
      return localResponse;
    }
  } catch (error) {
    // Network error, timeout, or CORS issue - try production
    if (error instanceof Error && error.name !== "AbortError") {
      if (process.env.NODE_ENV === "development") {
        console.error("Localhost request failed, trying production:", error.message);
      }
    }
  }

  // Fallback to production
  return fetch(productionUrl, options);
};

/**
 * Generic API error handler
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Handle API response and throw error if not ok
 */
export const handleApiResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new ApiError(
      error.message || `API Error: ${response.statusText}`,
      response.status,
      error
    );
  }

  return response.json();
};
