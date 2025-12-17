/**
 * Environment variable configuration
 * Centralized management of all environment variables with type safety
 *
 * Note: This module is compatible with Next.js server and client components
 * Uses getters to ensure environment variables are read at access time, not module load time
 */

// Determine environment
const nodeEnv = process.env.NODE_ENV || "development";
const isDevelopment = nodeEnv === "development";
const isProduction = nodeEnv === "production";

// Export env object with getters for Turbopack compatibility
export const env = {
  // Application
  get siteUrl(): string {
    return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  },
  get appName(): string {
    return process.env.NEXT_PUBLIC_APP_NAME || "Hometex Bangladesh";
  },

  // API Configuration - determined dynamically at access time
  get apiBaseUrl(): string {
    const useLocalApi = process.env.NEXT_PUBLIC_USE_LOCAL_API === "true";

    if (useLocalApi) {
      return process.env.NEXT_PUBLIC_API_LOCAL_URL || "http://localhost:8000";
    }

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

    // Warn in production if API URL is not configured
    if (isProduction && !apiBaseUrl && typeof window !== "undefined") {
      console.error(
        "🚨 PRODUCTION ERROR: NEXT_PUBLIC_API_BASE_URL is not set!\n" +
          "Please set it in your .env.production or deployment environment."
      );
    }

    return apiBaseUrl;
  },

  get apiLocalUrl(): string {
    return process.env.NEXT_PUBLIC_API_LOCAL_URL || "http://localhost:8000";
  },

  // Environment
  nodeEnv,
  isDevelopment,
  isProduction,

  // Analytics (Optional)
  get gaId(): string {
    return process.env.NEXT_PUBLIC_GA_ID || "";
  },
  get gtmId(): string {
    return process.env.NEXT_PUBLIC_GTM_ID || "";
  },

  // Feature Flags (Optional)
  get enableAnalytics(): boolean {
    return process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true";
  },
  get enableChat(): boolean {
    return process.env.NEXT_PUBLIC_ENABLE_CHAT !== "false"; // Default to true
  },
};

// Type-safe environment variable access
export type EnvConfig = typeof env;
