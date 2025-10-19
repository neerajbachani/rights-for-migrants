import { SubmitFormRequest, FormValidationResult, FormValidationError } from '../types/form';

/**
 * Validate form submission data
 */
export function validateFormSubmission(data: any): FormValidationResult {
  const errors: FormValidationError[] = [];

  // Check if data exists
  if (!data || typeof data !== 'object') {
    errors.push({
      field: 'general',
      message: 'Invalid form data'
    });
    return { isValid: false, errors };
  }

  // Validate name
  if (!data.name || typeof data.name !== 'string') {
    errors.push({
      field: 'name',
      message: 'Name is required'
    });
  } else if (data.name.trim().length === 0) {
    errors.push({
      field: 'name',
      message: 'Name cannot be empty'
    });
  } else if (data.name.trim().length > 100) {
    errors.push({
      field: 'name',
      message: 'Name must be less than 100 characters'
    });
  }

  // Validate email
  if (!data.email || typeof data.email !== 'string') {
    errors.push({
      field: 'email',
      message: 'Email is required'
    });
  } else if (data.email.trim().length === 0) {
    errors.push({
      field: 'email',
      message: 'Email cannot be empty'
    });
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email.trim())) {
      errors.push({
        field: 'email',
        message: 'Invalid email format'
      });
    } else if (data.email.trim().length > 255) {
      errors.push({
        field: 'email',
        message: 'Email must be less than 255 characters'
      });
    }
  }

  // Validate message
  if (!data.message || typeof data.message !== 'string') {
    errors.push({
      field: 'message',
      message: 'Message is required'
    });
  } else if (data.message.trim().length === 0) {
    errors.push({
      field: 'message',
      message: 'Message cannot be empty'
    });
  } else if (data.message.trim().length > 1000) {
    errors.push({
      field: 'message',
      message: 'Message must be less than 1000 characters'
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Sanitize form input to prevent XSS attacks
 */
export function sanitizeFormInput(data: SubmitFormRequest): SubmitFormRequest {
  return {
    name: sanitizeString(data.name),
    email: sanitizeString(data.email),
    message: sanitizeString(data.message)
  };
}

/**
 * Sanitize a string by removing potentially dangerous HTML/script content
 */
function sanitizeString(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    .trim()
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove script content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove javascript: protocols
    .replace(/javascript:/gi, '')
    // Remove on* event handlers
    .replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim();
}