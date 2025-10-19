// Client-side API utilities for image management

import { SocialMediaImage, ImagesResponse, UploadResponse, UpdateResponse, DeleteResponse } from '@/lib/types/image';

// Base API URL
const API_BASE = '/api/images';

// Fetch all images
export async function fetchImages(): Promise<SocialMediaImage[]> {
  try {
    const response = await fetch(API_BASE);
    const data: ImagesResponse = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch images');
    }
    
    return data.images;
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
}

// Upload new image
export async function uploadImage(file: File, metadata: { alt: string; title?: string; description?: string }): Promise<SocialMediaImage> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('alt', metadata.alt);
    if (metadata.title) formData.append('title', metadata.title);
    if (metadata.description) formData.append('description', metadata.description);
    
    const response = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData,
    });
    
    const data: UploadResponse = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to upload image');
    }
    
    if (!data.image) {
      throw new Error('No image data returned');
    }
    
    return data.image;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

// Update image metadata
export async function updateImage(imageId: string, updates: { alt?: string; title?: string; description?: string; order?: number }): Promise<SocialMediaImage> {
  try {
    const response = await fetch(`${API_BASE}/${imageId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    
    const data: UpdateResponse = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to update image');
    }
    
    if (!data.image) {
      throw new Error('No image data returned');
    }
    
    return data.image;
  } catch (error) {
    console.error('Error updating image:', error);
    throw error;
  }
}

// Replace image file with new file and metadata
export async function replaceImage(imageId: string, file: File, metadata: { alt: string; title?: string; description?: string; order?: number }): Promise<SocialMediaImage> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('alt', metadata.alt);
    if (metadata.title) formData.append('title', metadata.title);
    if (metadata.description) formData.append('description', metadata.description);
    if (metadata.order !== undefined) formData.append('order', metadata.order.toString());
    
    const response = await fetch(`${API_BASE}/${imageId}/replace`, {
      method: 'POST',
      body: formData,
    });
    
    const data: UpdateResponse = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to replace image');
    }
    
    if (!data.image) {
      throw new Error('No image data returned');
    }
    
    return data.image;
  } catch (error) {
    console.error('Error replacing image:', error);
    throw error;
  }
}

// Delete image
export async function deleteImage(imageId: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/${imageId}`, {
      method: 'DELETE',
    });
    
    const data: DeleteResponse = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to delete image');
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
}

// Bulk delete images
export async function bulkDeleteImages(imageIds: string[]): Promise<{ deletedCount: number; failedCount: number; failures?: Array<{ id: string; filename: string; error: string }> }> {
  try {
    const response = await fetch(`${API_BASE}/bulk-delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageIds }),
    });
    
    const data = await response.json();
    
    if (!data.success && data.failedCount === imageIds.length) {
      // All deletions failed
      throw new Error(data.error || 'Failed to delete images');
    }
    
    return {
      deletedCount: data.deletedCount || 0,
      failedCount: data.failedCount || 0,
      failures: data.failures
    };
  } catch (error) {
    console.error('Error bulk deleting images:', error);
    throw error;
  }
}

// Reorder images
export async function reorderImages(imageIds: string[]): Promise<SocialMediaImage[]> {
  try {
    const response = await fetch(`${API_BASE}/reorder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageIds }),
    });
    
    const data: ImagesResponse = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to reorder images');
    }
    
    return data.images;
  } catch (error) {
    console.error('Error reordering images:', error);
    throw error;
  }
}

// Validate image file on client side
export function validateImageFileClient(file: File): { isValid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (!file) {
    return { isValid: false, error: 'No file provided' };
  }
  
  if (file.size > maxSize) {
    return { isValid: false, error: 'File size too large. Maximum size is 5MB' };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed' };
  }
  
  return { isValid: true };
}