"use client";

import React, { createContext, useContext, useState, useEffect, startTransition } from "react";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface SignupData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  conf_password: string;
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
      const response = await fetch("https://www.hometexbd.ltd/api/customer-login", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          email, 
          password, 
          user_type: 3 
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }
      
      const data = await response.json();
      
      // Create user object from response
      const loggedInUser = {
        id: data.customer?.id || data.user?.id || "user-" + Date.now(),
        email: email,
        name: data.customer?.name || data.user?.name || email.split("@")[0],
      };
      
      setUser(loggedInUser);
      localStorage.setItem("hometex-user", JSON.stringify(loggedInUser));
      toast.success("Logged in successfully!");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to login";
      toast.error(errorMessage);
      throw error;
    }
  };

  const signup = async (signupData: SignupData) => {
    try {
      const response = await fetch("https://www.hometexbd.ltd/api/customer-signup", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(signupData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Signup failed");
      }
      
      const data = await response.json();
      
      // Create user object from response
      const newUser = {
        id: data.customer?.id || "user-" + Date.now(),
        email: signupData.email,
        name: `${signupData.first_name} ${signupData.last_name}`,
      };
      
      setUser(newUser);
      localStorage.setItem("hometex-user", JSON.stringify(newUser));
      toast.success("Account created successfully! Please check your email for verification.");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create account";
      toast.error(errorMessage);
      throw error;
    }
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

  const logout = async () => {
    try {
      await fetch("https://www.hometexbd.ltd/api/customer-logout", {
        method: "POST",
      });
      
      setUser(null);
      localStorage.removeItem("hometex-user");
      toast.success("Logged out successfully");
    } catch (error) {
      // Still logout locally even if API call fails
      setUser(null);
      localStorage.removeItem("hometex-user");
      toast.success("Logged out successfully");
    }
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
