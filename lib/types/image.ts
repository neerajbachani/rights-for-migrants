// Image management related types and interfaces

export interface SocialMediaImage {
  id: string;
  src: string;           // File path relative to public directory
  alt: string;           // Accessibility text
  title?: string;        // Optional title
  description?: string;  // Optional description
  filename: string;      // Original filename
  fileSize: number;      // File size in bytes
  mimeType: string;      // MIME type (image/jpeg, image/png, etc.)
  uploadedAt: Date;      // Upload timestamp
  updatedAt: Date;       // Last modification timestamp
  order: number;         // Display order in gallery
}

export interface ImageMetadata {
  alt: string;
  title?: string;
  description?: string;
}

export interface ImageUploadRequest {
  file: File;
  metadata: {
    alt: string;
    title?: string;
    description?: string;
  };
}

export interface ImageUpdateRequest {
  alt?: string;
  title?: string;
  description?: string;
  order?: number;
}

export interface ImagesResponse {
  success: boolean;
  images: SocialMediaImage[];
  error?: string;
}

export interface UploadResponse {
  success: boolean;
  image?: SocialMediaImage;
  error?: string;
}

export interface UpdateResponse {
  success: boolean;
  image?: SocialMediaImage;
  error?: string;
}

export interface DeleteResponse {
  success: boolean;
  error?: string;
}