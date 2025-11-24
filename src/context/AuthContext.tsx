"use client";

import React, { createContext, useContext, useState, useEffect, startTransition } from "react";
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
      
      const data = await response.json();
      
      if (!response.ok) {
        // Handle validation errors with field-specific messages
        if (data.error && typeof data.error === 'object') {
          const errorMessages: string[] = [];
          const fieldErrors: Record<string, string[]> = {};
          
          // Extract all field errors
          Object.keys(data.error).forEach((field) => {
            const fieldErrorArray = data.error[field];
            if (Array.isArray(fieldErrorArray)) {
              fieldErrors[field] = fieldErrorArray;
              fieldErrorArray.forEach((errorMsg) => {
                errorMessages.push(errorMsg);
                toast.error(errorMsg);
              });
            }
          });
          
          // Throw error with field errors attached
          if (errorMessages.length > 0) {
            const error: any = new Error(errorMessages.join(', '));
            error.fieldErrors = fieldErrors;
            throw error;
          }
        }
        
        // Fallback to generic error message
        const errorMessage = data.message || "Login failed";
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
      
      // Extract token from response
      const token = data.success?.authorisation?.token || data.authorisation?.token;
      
      // Create user object from response
      const loggedInUser = {
        id: data.customer?.id || data.user?.id || data.success?.id || "user-" + Date.now(),
        email: email,
        name: data.success?.name || data.customer?.name || data.user?.name || email.split("@")[0],
        token: token,
      };
      
      setUser(loggedInUser);
      localStorage.setItem("hometex-user", JSON.stringify(loggedInUser));
      
      // Store token separately for easy access
      if (token) {
        localStorage.setItem("hometex-auth-token", token);
      }
      
      toast.success(data.success?.message || "Logged in successfully!");
    } catch (error) {
      // Error already shown via toast in the try block
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
      
      const data = await response.json();
      
      if (!response.ok) {
        // Handle validation errors with field-specific messages
        if (data.error && typeof data.error === 'object') {
          const errorMessages: string[] = [];
          const fieldErrors: Record<string, string[]> = {};
          
          // Extract all field errors
          Object.keys(data.error).forEach((field) => {
            const fieldErrorArray = data.error[field];
            if (Array.isArray(fieldErrorArray)) {
              fieldErrors[field] = fieldErrorArray;
              fieldErrorArray.forEach((errorMsg) => {
                errorMessages.push(errorMsg);
                toast.error(errorMsg);
              });
            }
          });
          
          // Throw error with field errors attached
          if (errorMessages.length > 0) {
            const error: any = new Error(errorMessages.join(', '));
            error.fieldErrors = fieldErrors;
            throw error;
          }
        }
        
        // Fallback to generic error message
        const errorMessage = data.message || "Signup failed";
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
      
      // Extract token from response
      const token = data.success?.authorisation?.token || data.authorisation?.token;
      
      // Create user object from response
      const newUser = {
        id: data.customer?.id || data.success?.id || "user-" + Date.now(),
        email: signupData.email,
        name: data.success?.name || `${signupData.first_name} ${signupData.last_name}`,
        token: token,
      };
      
      setUser(newUser);
      localStorage.setItem("hometex-user", JSON.stringify(newUser));
      
      // Store token separately for easy access
      if (token) {
        localStorage.setItem("hometex-auth-token", token);
      }
      
      toast.success(data.success?.message || "Account created successfully!");
    } catch (error) {
      // Error already shown via toast in the try block
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
      const token = localStorage.getItem("hometex-auth-token");
      await fetch("https://www.hometexbd.ltd/api/customer-logout", {
        method: "POST",
        headers: token ? {
          "Authorization": `Bearer ${token}`
        } : {},
      });
      
      setUser(null);
      localStorage.removeItem("hometex-user");
      localStorage.removeItem("hometex-auth-token");
      toast.success("Logged out successfully");
    } catch (error) {
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
