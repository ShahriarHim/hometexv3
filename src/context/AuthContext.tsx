"use client";

import { ApiError, authService } from "@/services/api";
import { clearRecentViewsStorage } from "@/hooks/use-recent-views";
import React, { createContext, startTransition, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  token?: string;
}

export interface SignupData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  conf_password: string;
}

export interface ValidationError {
  fieldErrors?: Record<string, string[]>;
  message: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (signupData: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  socialLogin: (provider: "google" | "facebook") => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("hometex-user");
    if (savedUser) {
      startTransition(() => {
        setUser(JSON.parse(savedUser));
      });
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });

      // Log response for debugging
      if (process.env.NODE_ENV === "development") {
        console.log("Login response:", response);
      }

      // Extract token and user data from the response
      // Handle different response structures
      let userData: any = null;
      let token: string | undefined = undefined;

      if (response.data) {
        if (Array.isArray(response.data) && response.data.length > 0) {
          userData = response.data[0];
          token = userData?.token;
        } else if (typeof response.data === "object" && !Array.isArray(response.data)) {
          // Handle case where data is an object, not an array
          userData = response.data;
          token = (response.data as any)?.token;
        }
      }

      if (!userData || !token) {
        console.error("Login response structure:", response);
        throw new Error("Invalid response: user data or token not found");
      }

      if (!token) {
        console.error("No token found in login response");
        toast.error(
          "Login succeeded but no authentication token received. Please contact support."
        );
        throw new Error("No authentication token received");
      }

      // Create user object from response
      const loggedInUser = {
        id: String(userData.id),
        email: userData.email,
        name: userData.name || `${userData.first_name || ""} ${userData.last_name || ""}`.trim(),
        token: token,
      };

      setUser(loggedInUser);
      localStorage.setItem("hometex-user", JSON.stringify(loggedInUser));
      localStorage.setItem("hometex-auth-token", token);

      toast.success(response.message || "Logged in successfully!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Login failed. Please try again.");
      }
      throw error;
    }
  };

  const signup = async (signupData: SignupData) => {
    try {
      const response = await authService.signup(signupData);

      // Log response for debugging
      if (process.env.NODE_ENV === "development") {
        console.log("Signup response:", response);
      }

      // Extract token and user data from the response
      // API returns: { success: { name, authorisation: { token, type }, message } }
      let token: string | undefined = undefined;
      let userName: string | undefined = undefined;
      let message: string | undefined = undefined;

      if ((response as any).success) {
        const successData = (response as any).success;
        token = successData?.authorisation?.token;
        userName = successData?.name;
        message = successData?.message;
      } else if (response.data) {
        // Fallback to old structure if needed
        if (Array.isArray(response.data) && response.data.length > 0) {
          const userData = response.data[0];
          token = userData?.token;
          userName = userData?.name;
        } else if (typeof response.data === "object" && !Array.isArray(response.data)) {
          token = (response.data as any)?.token;
          userName = (response.data as any)?.name;
        }
        message = response.message;
      }

      if (!token) {
        console.error("Signup response structure:", response);
        throw new Error("Invalid response: authentication token not found");
      }

      // Create user object from response
      const newUser = {
        id: `user-${Date.now()}`, // Temporary ID since API doesn't return user ID in this structure
        email: signupData.email,
        name: userName || `${signupData.first_name} ${signupData.last_name}`.trim(),
        token: token,
      };

      setUser(newUser);
      localStorage.setItem("hometex-user", JSON.stringify(newUser));
      localStorage.setItem("hometex-auth-token", token);

      toast.success(message || "Account created successfully!");
    } catch (error) {
      const extractError = (err: unknown): string => {
        if (!err) return "Signup failed. Please try again.";
        const tryParse = (payload: Record<string, unknown>): string | null => {
          if (payload.errors && typeof payload.errors === "object") {
            const first = Object.values(payload.errors as Record<string, string[]>)[0];
            if (first?.[0]) return first[0];
          }
          if (payload.error && typeof payload.error === "object") {
            const first = Object.values(payload.error as Record<string, string[]>)[0];
            if (Array.isArray(first) && first[0]) return first[0] as string;
          }
          if (payload.message && typeof payload.message === "string") return payload.message;
          return null;
        };

        if (err instanceof ApiError && err.response && typeof err.response === "object") {
          const parsed = tryParse(err.response as Record<string, unknown>);
          if (parsed) return parsed;
        }

        if (err instanceof Error) {
          return err.message;
        }

        if (typeof err === "object") {
          const parsed = tryParse(err as Record<string, unknown>);
          if (parsed) return parsed;
        }

        return "Signup failed. Please try again.";
      };

      const errorMessage = extractError(error);

      // Extract field-specific errors for form display
      let fieldErrors: Record<string, string[]> = {};
      if (error instanceof ApiError && error.response && typeof error.response === "object") {
        const response = error.response as Record<string, unknown>;
        if (response.error && typeof response.error === "object") {
          fieldErrors = response.error as Record<string, string[]>;
        } else if (response.errors && typeof response.errors === "object") {
          fieldErrors = response.errors as Record<string, string[]>;
        }
      }

      // Create enhanced error with fieldErrors
      const enhancedError = new Error(errorMessage);
      (enhancedError as any).fieldErrors = fieldErrors;

      toast.error(errorMessage);
      throw enhancedError;
    }
  };

  const socialLogin = async (provider: "google" | "facebook") => {
    // TODO: Replace with actual OAuth flow
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockUser = {
      id: `user-${Date.now()}`,
      email: `user@${provider}.com`,
      name: `${provider} User`,
    };

    setUser(mockUser);
    localStorage.setItem("hometex-user", JSON.stringify(mockUser));
    toast.success(`Logged in with ${provider}`);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // ignore API errors on logout
    } finally {
      setUser(null);
      localStorage.removeItem("hometex-user");
      localStorage.removeItem("hometex-auth-token");
      clearRecentViewsStorage(); // Clear recent views on logout
      toast.success("Logged out successfully");
      // Redirect to home
      window.location.href = "/";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        login,
        signup,
        logout,
        socialLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
