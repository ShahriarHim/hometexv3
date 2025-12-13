/**
 * API Client - Core HTTP client with authentication and fallback logic
 * Follows Next.js best practices for data fetching
 */

import { env } from "@/lib/env";

/**
 * Normalize URL to ensure it has a protocol
 * Adds http:// if no protocol is present
 */
const normalizeUrl = (url: string): string => {
  if (!url) {
    return url;
  }

  // If URL already has protocol, return as-is
  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  // If URL starts with //, it's protocol-relative, add http:
  if (url.startsWith("//")) {
    return `http:${url}`;
  }

  // Otherwise, add http:// prefix
  return `http://${url}`;
};

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
    Accept: "application/json",
  };

  if (token) {
    Object.assign(headers, { Authorization: `Bearer ${token}` });
  }

  // Only include credentials if explicitly requested in options
  // This avoids CORS issues when server uses wildcard Access-Control-Allow-Origin
  const fetchOptions: RequestInit = {
    ...options,
    headers,
  };

  // Allow credentials to be overridden per request if needed
  if (options.credentials !== undefined) {
    fetchOptions.credentials = options.credentials;
  }

  return fetch(url, fetchOptions);
};

/**
 * Fetch with localhost fallback for authenticated requests
 * Tries localhost first, then falls back to production
 * Skips localhost if API base URL is explicitly set via environment variable
 */
export const fetchWithFallback = async (
  endpoint: string,
  productionBaseUrl: string,
  options: RequestInit = {}
): Promise<Response> => {
  const normalizedProductionBaseUrl = normalizeUrl(productionBaseUrl);
  const productionUrl = `${normalizedProductionBaseUrl}${endpoint}`;

  // Skip localhost fallback if API base URL is not localhost
  if (env.shouldSkipLocalhostFallback) {
    return authenticatedFetch(productionUrl, options);
  }

  const localhostUrl = `${env.apiLocalUrl}${endpoint}`;

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
    // This is expected behavior if localhost API is not running, silently fall back
  }

  // Fallback to production
  return authenticatedFetch(productionUrl, options);
};

/**
 * Fetch with localhost fallback for public requests (no authentication)
 * Skips localhost if API base URL is explicitly set via environment variable
 */
export const fetchPublicWithFallback = async (
  endpoint: string,
  productionBaseUrl: string,
  options: RequestInit = {}
): Promise<Response> => {
  const normalizedProductionBaseUrl = normalizeUrl(productionBaseUrl);
  const productionUrl = `${normalizedProductionBaseUrl}${endpoint}`;

  // Skip localhost fallback if API base URL is not localhost
  if (env.shouldSkipLocalhostFallback) {
    return fetch(productionUrl, options);
  }

  const localhostUrl = `${env.apiLocalUrl}${endpoint}`;

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
    // This is expected behavior if localhost API is not running, silently fall back
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
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    // Try to extract error message from various response formats
    let errorMessage = `API Error: ${response.statusText}`;

    if (data.message) {
      errorMessage = data.message;
    } else if (data.error) {
      errorMessage = typeof data.error === "string" ? data.error : JSON.stringify(data.error);
    } else if (data.errors && typeof data.errors === "object") {
      // Handle Laravel validation errors
      const errorMessages = Object.values(data.errors).flat();
      errorMessage = errorMessages.join(", ");
    }

    throw new ApiError(errorMessage, response.status, data);
  }

  return data as T;
};
