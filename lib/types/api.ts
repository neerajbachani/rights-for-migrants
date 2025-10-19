// Common API types and error handling interfaces

export interface APIError {
  success: false;
  error: string;
  code: string;
  details?: Record<string, any>;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

// Re-export all types for convenience
export * from './auth';
export * from './image';