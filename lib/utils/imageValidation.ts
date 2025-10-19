// Image validation utilities for file upload security

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Allowed image MIME types
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp'
];

// Allowed file extensions
const ALLOWED_EXTENSIONS = [
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.webp'
];

// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Minimum dimensions
const MIN_WIDTH = 100;
const MIN_HEIGHT = 100;

// Maximum dimensions
const MAX_WIDTH = 4000;
const MAX_HEIGHT = 4000;

export function validateImageFile(file: File): ValidationResult {
  // Check if file exists
  if (!file) {
    return {
      isValid: false,
      error: 'No file provided'
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File size too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`
    };
  }

  if (file.size === 0) {
    return {
      isValid: false,
      error: 'File is empty'
    };
  }

  // Check MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: `Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`
    };
  }

  // Check file extension
  const fileName = file.name.toLowerCase();
  const hasValidExtension = ALLOWED_EXTENSIONS.some(ext => fileName.endsWith(ext));
  
  if (!hasValidExtension) {
    return {
      isValid: false,
      error: `Invalid file extension. Allowed extensions: ${ALLOWED_EXTENSIONS.join(', ')}`
    };
  }

  // Check filename for security
  if (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
    return {
      isValid: false,
      error: 'Invalid filename. Filename contains illegal characters'
    };
  }

  return {
    isValid: true
  };
}

// Validate image dimensions (requires browser environment)
export async function validateImageDimensions(file: File): Promise<ValidationResult> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      
      if (img.width < MIN_WIDTH || img.height < MIN_HEIGHT) {
        resolve({
          isValid: false,
          error: `Image dimensions too small. Minimum size is ${MIN_WIDTH}x${MIN_HEIGHT}px`
        });
        return;
      }

      if (img.width > MAX_WIDTH || img.height > MAX_HEIGHT) {
        resolve({
          isValid: false,
          error: `Image dimensions too large. Maximum size is ${MAX_WIDTH}x${MAX_HEIGHT}px`
        });
        return;
      }

      resolve({
        isValid: true
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({
        isValid: false,
        error: 'Invalid image file or corrupted data'
      });
    };

    img.src = url;
  });
}

// Sanitize filename for safe storage
export function sanitizeFilename(filename: string): string {
  // Remove path separators and other dangerous characters
  let sanitized = filename.replace(/[\/\\:*?"<>|]/g, '');
  
  // Remove leading/trailing dots and spaces
  sanitized = sanitized.replace(/^[.\s]+|[.\s]+$/g, '');
  
  // Limit length
  if (sanitized.length > 100) {
    const ext = sanitized.substring(sanitized.lastIndexOf('.'));
    const name = sanitized.substring(0, sanitized.lastIndexOf('.'));
    sanitized = name.substring(0, 100 - ext.length) + ext;
  }
  
  // Ensure we have a filename
  if (!sanitized) {
    sanitized = 'image';
  }
  
  return sanitized;
}

// Check if file is actually an image by reading file signature
export async function validateFileSignature(file: File): Promise<ValidationResult> {
  try {
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    
    // Check for common image file signatures
    const signatures = {
      jpeg: [0xFF, 0xD8, 0xFF],
      png: [0x89, 0x50, 0x4E, 0x47],
      gif: [0x47, 0x49, 0x46],
      webp: [0x52, 0x49, 0x46, 0x46] // RIFF header for WebP
    };
    
    for (const [format, signature] of Object.entries(signatures)) {
      if (signature.every((byte, index) => bytes[index] === byte)) {
        return { isValid: true };
      }
    }
    
    return {
      isValid: false,
      error: 'File does not appear to be a valid image'
    };
  } catch (error) {
    return {
      isValid: false,
      error: 'Unable to validate file signature'
    };
  }
}