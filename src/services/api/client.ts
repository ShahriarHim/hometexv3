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
