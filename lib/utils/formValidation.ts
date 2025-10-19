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

  // Validate email (optional)
  if (data.email && typeof data.email === 'string') {
    if (data.email.trim().length > 0) {
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
  }

  // Validate phone
  if (!data.phone || typeof data.phone !== 'string') {
    errors.push({
      field: 'phone',
      message: 'Phone number is required'
    });
  } else if (data.phone.trim().length === 0) {
    errors.push({
      field: 'phone',
      message: 'Phone number cannot be empty'
    });
  } else if (data.phone.trim().length > 20) {
    errors.push({
      field: 'phone',
      message: 'Phone number must be less than 20 characters'
    });
  }

  // Validate address
  if (!data.address || typeof data.address !== 'string') {
    errors.push({
      field: 'address',
      message: 'Address is required'
    });
  } else if (data.address.trim().length === 0) {
    errors.push({
      field: 'address',
      message: 'Address cannot be empty'
    });
  } else if (data.address.trim().length > 500) {
    errors.push({
      field: 'address',
      message: 'Address must be less than 500 characters'
    });
  }

  // Validate nationality
  if (!data.nationality || typeof data.nationality !== 'string') {
    errors.push({
      field: 'nationality',
      message: 'Nationality is required'
    });
  } else if (data.nationality.trim().length === 0) {
    errors.push({
      field: 'nationality',
      message: 'Nationality cannot be empty'
    });
  } else if (data.nationality.trim().length > 100) {
    errors.push({
      field: 'nationality',
      message: 'Nationality must be less than 100 characters'
    });
  }

  // Validate visa status
  if (!data.visaStatus || typeof data.visaStatus !== 'string') {
    errors.push({
      field: 'visaStatus',
      message: 'Visa status is required'
    });
  } else if (data.visaStatus.trim().length === 0) {
    errors.push({
      field: 'visaStatus',
      message: 'Visa status cannot be empty'
    });
  } else if (data.visaStatus.trim().length > 100) {
    errors.push({
      field: 'visaStatus',
      message: 'Visa status must be less than 100 characters'
    });
  }

  // Validate message (optional)
  if (data.message && typeof data.message === 'string') {
    if (data.message.trim().length > 1000) {
      errors.push({
        field: 'message',
        message: 'Message must be less than 1000 characters'
      });
    }
  }

  // Validate consent
  if (typeof data.consent !== 'boolean') {
    errors.push({
      field: 'consent',
      message: 'Consent must be a boolean value'
    });
  } else if (data.consent !== true) {
    errors.push({
      field: 'consent',
      message: 'You must agree to the terms and conditions'
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
    email: data.email ? sanitizeString(data.email) : undefined,
    phone: sanitizeString(data.phone),
    address: sanitizeString(data.address),
    nationality: sanitizeString(data.nationality),
    visaStatus: sanitizeString(data.visaStatus),
    message: data.message ? sanitizeString(data.message) : undefined,
    consent: Boolean(data.consent)
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