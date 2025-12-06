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

// Export env object - using explicit object literal for Turbopack compatibility
export const env = Object.freeze({
  // Application
  siteUrl: getOptionalEnvVar("NEXT_PUBLIC_SITE_URL", "http://localhost:3000"),
  appName: getOptionalEnvVar("NEXT_PUBLIC_APP_NAME", "Hometex Bangladesh"),

  // API Configuration
  apiBaseUrl: getOptionalEnvVar("NEXT_PUBLIC_API_BASE_URL", "https://www.hometexbd.ltd"),
  apiLocalUrl: getOptionalEnvVar("NEXT_PUBLIC_API_LOCAL_URL", "http://localhost:8000"),

  // Environment
  nodeEnv: getOptionalEnvVar("NODE_ENV", "development"),
  isDevelopment:
    typeof process !== "undefined" && process.env ? process.env.NODE_ENV === "development" : false,
  isProduction:
    typeof process !== "undefined" && process.env ? process.env.NODE_ENV === "production" : false,

  // Analytics (Optional)
  gaId: getOptionalEnvVar("NEXT_PUBLIC_GA_ID", ""),
  gtmId: getOptionalEnvVar("NEXT_PUBLIC_GTM_ID", ""),

  // Feature Flags (Optional)
  enableAnalytics: getOptionalEnvVar("NEXT_PUBLIC_ENABLE_ANALYTICS", "false") === "true",
  enableChat: getOptionalEnvVar("NEXT_PUBLIC_ENABLE_CHAT", "true") === "true",
});

// Type-safe environment variable access
export type EnvConfig = typeof env;
