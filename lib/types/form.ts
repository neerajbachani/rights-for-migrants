// Form submission related types and interfaces
import { FormSubmission as PrismaFormSubmission } from '../generated/prisma';

// Use Prisma-generated type as base and extend if needed
export type FormSubmission = PrismaFormSubmission;

// Status type for better type safety
export type FormSubmissionStatus = 'new' | 'read' | 'archived';

export interface SubmitFormRequest {
  name: string;
  email: string;
  message: string;
}

export interface SubmitFormResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface GetSubmissionsResponse {
  success: boolean;
  submissions: FormSubmission[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UpdateStatusRequest {
  status: FormSubmissionStatus;
}

export interface BulkOperationRequest {
  action: 'delete' | 'updateStatus';
  submissionIds: string[];
  status?: FormSubmissionStatus;
}

export interface ExportFilters {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Error response format
export interface ErrorResponse {
  success: false;
  error: string;
  code: string;
  details?: {
    field?: string;
    message?: string;
  }[];
}

// Form validation types
export interface FormValidationError {
  field: string;
  message: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: FormValidationError[];
}