/**
 * API Client - Core HTTP client with authentication
 * Simple and direct - uses environment variable to determine API URL
 */

import { env } from "@/lib/env";

/**
 * Get the base URL to use for API calls
 * Controlled by NEXT_PUBLIC_USE_LOCAL_API environment variable
 * - Set to "true" to use localhost API (http://localhost:8000)
 * - Set to "false" or leave unset to use production API
 */
const getBaseUrl = (productionBaseUrl: string): string => {
  // Check environment variable from process.env (works in both server and client in Next.js)
  const useLocalApiEnv = process.env.NEXT_PUBLIC_USE_LOCAL_API;
  const useLocalApi = useLocalApiEnv === "true";

  const baseUrl = useLocalApi ? env.apiLocalUrl : productionBaseUrl;

  if (
    typeof window !== "undefined" &&
    !(window as Window & { __API_URL_LOGGED__?: boolean }).__API_URL_LOGGED__
  ) {
    // eslint-disable-next-line no-console
    console.log(`🔗 API Configuration:
  USE_LOCAL_API env: ${useLocalApiEnv}
  useLocalApi boolean: ${useLocalApi}
  env.apiLocalUrl: ${env.apiLocalUrl}
  productionBaseUrl: ${productionBaseUrl}
  Selected baseUrl: ${baseUrl}`);
    (window as unknown as Window & { __API_URL_LOGGED__: boolean }).__API_URL_LOGGED__ = true;
  }

  return baseUrl;
};

/**
 * Get authentication token from localStorage (client-side)
 */
export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("hometex-auth-token");

    // Debug logging - always log on staging to help debug
    if (!token && (process.env.NODE_ENV === "development" || typeof window !== "undefined")) {
      console.warn(
        "[getAuthToken] No token found in localStorage. User might need to log in again."
      );
      // eslint-disable-next-line no-console
      console.log("[getAuthToken] localStorage keys:", Object.keys(localStorage));
    }

    return token;
  }
  return null;
};

/**
 * Get authentication token from cookies (server-side and client-side)
 * This is used for server-side rendering and API requests
 */
export const getAuthTokenFromCookie = (): string | null => {
  if (typeof window !== "undefined") {
    // Client-side: try localStorage first, then cookies
    const localToken = localStorage.getItem("hometex-auth-token");
    if (localToken) {
      return localToken;
    }

    // Fall back to cookies
    const match = document.cookie.match(/hometex-auth-token=([^;]+)/);
    return match ? match[1] : null;
  }

  // Server-side: check headers (this requires context to be passed)
  return null;
};

/**
 * Make authenticated API requests with Bearer token
 */
export const authenticatedFetch = (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = getAuthToken();

  // Debug logging for token retrieval - enabled for all environments during debugging
  if (typeof window !== "undefined") {
    // eslint-disable-next-line no-console
    console.log(`[authenticatedFetch] API Request:`, {
      url,
      hasToken: !!token,
      tokenLength: token?.length || 0,
      tokenPreview: token?.substring(0, 15),
      isGoogleToken: token?.startsWith("ya29"),
      hasAuthHeader: !!token,
    });
  }

  const headers = {
    ...options.headers,
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (token) {
    Object.assign(headers, { Authorization: `Bearer ${token}` });
  } else if (typeof window !== "undefined") {
    console.warn(`[authenticatedFetch] No token found for authenticated request to ${url}`);
  }

  // Use the Bearer token in the Authorization header
  // Don't use credentials: "include" as it conflicts with CORS wildcard origin
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
 * Fetch with environment-based URL selection for authenticated requests
 */
export const fetchWithFallback = (
  endpoint: string,
  productionBaseUrl: string,
  options: RequestInit = {}
): Promise<Response> => {
  const baseUrl = getBaseUrl(productionBaseUrl);
  const fullUrl = `${baseUrl}${endpoint}`;

  return authenticatedFetch(fullUrl, options);
};

/**
 * Fetch with environment-based URL selection for public requests (no authentication)
 */
export const fetchPublicWithFallback = async (
  endpoint: string,
  productionBaseUrl: string,
  options: RequestInit = {}
): Promise<Response> => {
  const baseUrl = getBaseUrl(productionBaseUrl);
  const fullUrl = `${baseUrl}${endpoint}`;

  // eslint-disable-next-line no-console
  console.log(`Fetching from: ${fullUrl}`);

  try {
    const response = await fetch(fullUrl, options);
    // eslint-disable-next-line no-console
    console.log(`Response status: ${response.status} ${response.statusText}`);
    return response;
  } catch (error) {
    console.error(`Fetch error for ${fullUrl}:`, error);
    throw error;
  }
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

  // Helper function to normalize error messages
  const normalizeErrorMessage = (message: string): string => {
    if (message.includes("toDayDateTimeString") || message.includes("on null")) {
      return "Server error: Incomplete order data. Please contact support.";
    }
    if (message.includes("not found") || message.includes("Order not found")) {
      return "Order not found. Please check the order number and try again.";
    }
    if (message.includes("Failed to retrieve")) {
      return "Unable to load order details. Please try again later or contact support.";
    }
    return message;
  };

  // Check if response indicates failure (either by status or success flag)
  if (!response.ok || data.success === false) {
    let errorMessage = `API Error: ${response.statusText}`;

    // Prioritize message from data if available
    if (data.message) {
      errorMessage = data.message;
    } else if (data.error) {
      errorMessage = typeof data.error === "string" ? data.error : JSON.stringify(data.error);
    } else if (data.errors && typeof data.errors === "object") {
      // Handle Laravel validation errors
      const errorMessages = Object.values(data.errors).flat();
      errorMessage = errorMessages.join(", ");
    }

    // Normalize the error message for user-friendly display
    errorMessage = normalizeErrorMessage(errorMessage);

    throw new ApiError(errorMessage, response.status || 500, data);
  }

  return data as T;
};
