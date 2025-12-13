/**
 * Environment variable configuration
 * Centralized management of all environment variables with type safety
 *
 * Note: This module is compatible with Next.js server and client components
 */

// Helper functions
function getOptionalEnvVar(key: string, defaultValue: string = ""): string {
  if (typeof process !== "undefined" && process.env) {
    const value = process.env[key];
    if (value) {
      // Trim whitespace
      let trimmed = value.trim();
      // Remove surrounding quotes if present (handles "value" or 'value')
      if (
        (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
        (trimmed.startsWith("'") && trimmed.endsWith("'"))
      ) {
        trimmed = trimmed.slice(1, -1).trim();
      }
      return trimmed || defaultValue;
    }
  }
  return defaultValue;
}

// Determine environment
const nodeEnv = getOptionalEnvVar("NODE_ENV", "development");
const isDevelopment = nodeEnv === "development";
const isProduction = nodeEnv === "production";

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

// Determine API base URL based on environment
const getApiBaseUrl = (): string => {
  // If explicitly set via env var, use that
  const explicitApiUrl = getOptionalEnvVar("NEXT_PUBLIC_API_BASE_URL", "http://123.176.58.209");

  if (explicitApiUrl) {
    if (isDevelopment) {
      // eslint-disable-next-line no-console
      console.log("[env] Using NEXT_PUBLIC_API_BASE_URL:", explicitApiUrl);
    }
    return normalizeUrl(explicitApiUrl);
  }


  // Auto-detect based on environment and hostname
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    // Use localhost API in development or when on localhost
    if (isDevelopment || hostname === "localhost" || hostname === "127.0.0.1") {
      return normalizeUrl(getOptionalEnvVar("NEXT_PUBLIC_API_LOCAL_URL", "http://localhost:8000"));
    }
  } else if (isDevelopment) {
    // Server-side in development
    return normalizeUrl(getOptionalEnvVar("NEXT_PUBLIC_API_LOCAL_URL", "http://localhost:8000"));
  }

  // Production fallback
  return normalizeUrl("https://www.hometexbd.ltd");
};

// Check if we should skip localhost fallback
// Skip localhost if API base URL is not localhost (user has explicitly set a different URL)
const shouldSkipLocalhostFallback = (): boolean => {
  const apiBaseUrl = getApiBaseUrl();
  const localhostPattern = /^https?:\/\/(localhost|127\.0\.0\.1)/i;
  return !localhostPattern.test(apiBaseUrl);
};

// Export env object - using explicit object literal for Turbopack compatibility
export const env = Object.freeze({
  // Application
  siteUrl: getOptionalEnvVar("NEXT_PUBLIC_SITE_URL", "http://localhost:3000"),
  appName: getOptionalEnvVar("NEXT_PUBLIC_APP_NAME", "Hometex Bangladesh"),

  // API Configuration
  apiBaseUrl: getApiBaseUrl(),
  apiLocalUrl: getOptionalEnvVar("NEXT_PUBLIC_API_LOCAL_URL", "http://localhost:8000"),
  shouldSkipLocalhostFallback: shouldSkipLocalhostFallback(),

  // Environment
  nodeEnv,
  isDevelopment,
  isProduction,

  // Analytics (Optional)
  gaId: getOptionalEnvVar("NEXT_PUBLIC_GA_ID", ""),
  gtmId: getOptionalEnvVar("NEXT_PUBLIC_GTM_ID", ""),

  // Feature Flags (Optional)
  enableAnalytics: getOptionalEnvVar("NEXT_PUBLIC_ENABLE_ANALYTICS", "false") === "true",
  enableChat: getOptionalEnvVar("NEXT_PUBLIC_ENABLE_CHAT", "true") === "true",
});

// Type-safe environment variable access
export type EnvConfig = typeof env;
