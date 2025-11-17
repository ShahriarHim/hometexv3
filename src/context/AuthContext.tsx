"use client";

import React, { createContext, useContext, useState, useEffect, startTransition } from "react";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
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
    // TODO: Replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const mockUser = {
      id: "user-" + Date.now(),
      email,
      name: email.split("@")[0],
    };
    
    setUser(mockUser);
    localStorage.setItem("hometex-user", JSON.stringify(mockUser));
    toast.success("Logged in successfully");
  };

  const signup = async (email: string, password: string, name: string) => {
    // TODO: Replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const mockUser = {
      id: "user-" + Date.now(),
      email,
      name,
    };
    
    setUser(mockUser);
    localStorage.setItem("hometex-user", JSON.stringify(mockUser));
    toast.success("Account created successfully");
  };

  const socialLogin = async (provider: "google" | "facebook") => {
    // TODO: Replace with actual OAuth flow
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const mockUser = {
      id: "user-" + Date.now(),
      email: `user@${provider}.com`,
      name: `${provider} User`,
    };
    
    setUser(mockUser);
    localStorage.setItem("hometex-user", JSON.stringify(mockUser));
    toast.success(`Logged in with ${provider}`);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("hometex-user");
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
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
