"use client"

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { SocialMediaImage } from '@/lib/types/image';
import { fetchImages, uploadImage, updateImage, deleteImage, bulkDeleteImages, reorderImages, replaceImage } from '@/lib/utils/imageApi';

// Action types for the reducer
type ImagesAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_IMAGES'; payload: SocialMediaImage[] }
  | { type: 'ADD_IMAGE'; payload: SocialMediaImage }
  | { type: 'UPDATE_IMAGE'; payload: SocialMediaImage }
  | { type: 'DELETE_IMAGE'; payload: string }
  | { type: 'DELETE_IMAGES'; payload: string[] }
  | { type: 'REORDER_IMAGES'; payload: SocialMediaImage[] }
  | { type: 'SET_ERROR'; payload: string | null };

// State interface
interface ImagesState {
  images: SocialMediaImage[];
  loading: boolean;
  error: string | null;
}

// Context interface
interface ImagesContextType extends ImagesState {
  refreshImages: () => Promise<void>;
  uploadNewImage: (file: File, metadata: { alt: string; title?: string; description?: string }) => Promise<SocialMediaImage>;
  updateImageData: (imageId: string, updates: { alt?: string; title?: string; description?: string; order?: number }) => Promise<SocialMediaImage>;
  replaceImageFile: (imageId: string, file: File, metadata: { alt: string; title?: string; description?: string; order?: number }) => Promise<SocialMediaImage>;
  deleteImageById: (imageId: string) => Promise<void>;
  bulkDeleteImagesByIds: (imageIds: string[]) => Promise<{ deletedCount: number; failedCount: number; failures?: Array<{ id: string; filename: string; error: string }> }>;
  reorderImagesByIds: (imageIds: string[]) => Promise<void>;
}

// Initial state
const initialState: ImagesState = {
  images: [],
  loading: false,
  error: null,
};

// Reducer function
function imagesReducer(state: ImagesState, action: ImagesAction): ImagesState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_IMAGES':
      return { ...state, images: action.payload, loading: false, error: null };
    case 'ADD_IMAGE':
      return { 
        ...state, 
        images: [...state.images, action.payload].sort((a, b) => a.order - b.order),
        loading: false,
        error: null 
      };
    case 'UPDATE_IMAGE':
      return {
        ...state,
        images: state.images
          .map(img => img.id === action.payload.id ? action.payload : img)
          .sort((a, b) => a.order - b.order),
        loading: false,
        error: null
      };
    case 'DELETE_IMAGE':
      return {
        ...state,
        images: state.images.filter(img => img.id !== action.payload),
        loading: false,
        error: null
      };
    case 'DELETE_IMAGES':
      return {
        ...state,
        images: state.images.filter(img => !action.payload.includes(img.id)),
        loading: false,
        error: null
      };
    case 'REORDER_IMAGES':
      return {
        ...state,
        images: action.payload,
        loading: false,
        error: null
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

// Create context
const ImagesContext = createContext<ImagesContextType | undefined>(undefined);

// Provider component
export function ImagesProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(imagesReducer, initialState);

  // Refresh images from API
  const refreshImages = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const images = await fetchImages();
      dispatch({ type: 'SET_IMAGES', payload: images });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to fetch images' });
    }
  }, []);

  // Upload new image with optimistic update
  const uploadNewImage = useCallback(async (file: File, metadata: { alt: string; title?: string; description?: string }) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const newImage = await uploadImage(file, metadata);
      dispatch({ type: 'ADD_IMAGE', payload: newImage });
      return newImage;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to upload image' });
      throw error;
    }
  }, []);

  // Update image metadata with optimistic update
  const updateImageData = useCallback(async (imageId: string, updates: { alt?: string; title?: string; description?: string; order?: number }) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedImage = await updateImage(imageId, updates);
      dispatch({ type: 'UPDATE_IMAGE', payload: updatedImage });
      return updatedImage;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to update image' });
      throw error;
    }
  }, []);

  // Replace image file with optimistic update
  const replaceImageFile = useCallback(async (imageId: string, file: File, metadata: { alt: string; title?: string; description?: string; order?: number }) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedImage = await replaceImage(imageId, file, metadata);
      dispatch({ type: 'UPDATE_IMAGE', payload: updatedImage });
      return updatedImage;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to replace image' });
      throw error;
    }
  }, []);

  // Delete image with optimistic update
  const deleteImageById = useCallback(async (imageId: string) => {
    try {
      // Optimistic update - remove from UI immediately
      dispatch({ type: 'DELETE_IMAGE', payload: imageId });
      await deleteImage(imageId);
    } catch (error) {
      // Revert optimistic update by refreshing
      await refreshImages();
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to delete image' });
      throw error;
    }
  }, [refreshImages]);

  // Bulk delete images with optimistic update
  const bulkDeleteImagesByIds = useCallback(async (imageIds: string[]) => {
    try {
      // Optimistic update - remove from UI immediately
      dispatch({ type: 'DELETE_IMAGES', payload: imageIds });
      const result = await bulkDeleteImages(imageIds);
      
      // If some deletions failed, refresh to get accurate state
      if (result.failedCount > 0) {
        await refreshImages();
      }
      
      return result;
    } catch (error) {
      // Revert optimistic update by refreshing
      await refreshImages();
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to delete images' });
      throw error;
    }
  }, [refreshImages]);

  // Reorder images with optimistic update
  const reorderImagesByIds = useCallback(async (imageIds: string[]) => {
    try {
      const reorderedImages = await reorderImages(imageIds);
      dispatch({ type: 'REORDER_IMAGES', payload: reorderedImages });
    } catch (error) {
      // Revert by refreshing
      await refreshImages();
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to reorder images' });
      throw error;
    }
  }, [refreshImages]);

  // Load images on mount
  useEffect(() => {
    refreshImages();
  }, [refreshImages]);

  const contextValue: ImagesContextType = {
    ...state,
    refreshImages,
    uploadNewImage,
    updateImageData,
    replaceImageFile,
    deleteImageById,
    bulkDeleteImagesByIds,
    reorderImagesByIds,
  };

  return (
    <ImagesContext.Provider value={contextValue}>
      {children}
    </ImagesContext.Provider>
  );
}

// Hook to use the context
export function useImages() {
  const context = useContext(ImagesContext);
  if (context === undefined) {
    throw new Error('useImages must be used within an ImagesProvider');
  }
  return context;
}