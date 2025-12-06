/**
 * Environment variable configuration
 * Centralized management of all environment variables with type safety
 *
 * Note: This module is compatible with Next.js server and client components
 */

// Helper functions
function getOptionalEnvVar(key: string, defaultValue: string = ""): string {
  if (typeof process !== "undefined" && process.env) {
    return process.env[key] || defaultValue;
  }
  return defaultValue;
}

// Determine environment
const nodeEnv = getOptionalEnvVar("NODE_ENV", "development");
const isDevelopment = nodeEnv === "development";
const isProduction = nodeEnv === "production";

// Determine API base URL based on environment
const getApiBaseUrl = (): string => {
  // If explicitly set via env var, use that
  const explicitApiUrl = getOptionalEnvVar("NEXT_PUBLIC_API_BASE_URL", "");
  if (explicitApiUrl) {
    return explicitApiUrl;
  }

  // Auto-detect based on environment and hostname
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    // Use localhost API in development or when on localhost
    if (isDevelopment || hostname === "localhost" || hostname === "127.0.0.1") {
      return getOptionalEnvVar("NEXT_PUBLIC_API_LOCAL_URL", "http://localhost:8000");
    }
  } else if (isDevelopment) {
    // Server-side in development
    return getOptionalEnvVar("NEXT_PUBLIC_API_LOCAL_URL", "http://localhost:8000");
  }

  // Production fallback
  return "https://www.hometexbd.ltd";
};

// Export env object - using explicit object literal for Turbopack compatibility
export const env = Object.freeze({
  // Application
  siteUrl: getOptionalEnvVar("NEXT_PUBLIC_SITE_URL", "http://localhost:3000"),
  appName: getOptionalEnvVar("NEXT_PUBLIC_APP_NAME", "Hometex Bangladesh"),

  // API Configuration
  apiBaseUrl: getApiBaseUrl(),
  apiLocalUrl: getOptionalEnvVar("NEXT_PUBLIC_API_LOCAL_URL", "http://localhost:8000"),

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
