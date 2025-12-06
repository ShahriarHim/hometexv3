"use client";

import { authService } from "@/services/api";
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

      // Extract token and user data from the response (data is an array)
      const userData = response.data[0];
      const token = userData.token;

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
        name: userData.name || `${userData.first_name} ${userData.last_name}`,
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

      // Extract token and user data from the response
      const userData = response.data[0];
      const token = userData.token;

      if (!token) {
        console.error("No token found in signup response");
      }

      // Create user object from response
      const newUser = {
        id: String(userData.id),
        email: userData.email,
        name: userData.name,
        token: token,
      };

      setUser(newUser);
      localStorage.setItem("hometex-user", JSON.stringify(newUser));
      localStorage.setItem("hometex-auth-token", token);

      toast.success(response.message || "Account created successfully!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Signup failed. Please try again.");
      }
      throw error;
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

      setUser(null);
      localStorage.removeItem("hometex-user");
      localStorage.removeItem("hometex-auth-token");
      toast.success("Logged out successfully");
    } catch {
      // Still logout locally even if API call fails
      setUser(null);
      localStorage.removeItem("hometex-user");
      localStorage.removeItem("hometex-auth-token");
      toast.success("Logged out successfully");
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
