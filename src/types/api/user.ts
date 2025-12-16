/**
 * User & Authentication Types
 */

// User Profile
export interface UserProfile {
  id: number;
  uuid?: string;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  user_type?: string;
  roles?: string[];
  permissions?: string[];
  created_at?: string;
  updated_at?: string;
}

// Login
export interface LoginRequest {
  email: string;
  password: string;
  user_type?: number;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: Array<{
    id: number;
    email: string;
    name: string;
    first_name: string;
    last_name: string;
    phone: string;
    avatar?: string;
    token: string;
    user_type: string;
    roles: string[];
    permissions: string[];
  }>;
}

// Signup
export interface SignupRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  conf_password: string;
}

export interface SignupResponse {
  success: {
    name: string;
    statue: number;
    message: string;
    authorisation: {
      token: string;
      type: string;
    };
  };
  // Fallback for old structure (optional)
  message?: string;
  data?: Array<{
    id: number;
    email: string;
    name: string;
    token: string;
  }>;
}

// Profile Response
export interface ProfileResponse {
  status: string;
  user: UserProfile;
  customer_info: Record<string, unknown> | null;
  addresses: Array<{
    id: number;
    address: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
    is_default: boolean;
  }>;
}
