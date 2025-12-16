/**
 * Common API Types
 */

// Generic API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Pagination
export interface PaginationParams {
  page?: number;
  per_page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

// Generic error response
export interface ErrorResponse {
  message: string;
  error?: string | Record<string, string[]>;
  errors?: Record<string, string[]>;
}

// API Meta information
export interface ApiMeta {
  request_id?: string;
  timestamp?: string;
  response_time_ms?: number;
}
