'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SocialMediaImage } from '@/lib/types/image';
import { useImages } from '@/lib/contexts/ImagesContext';
import { validateImageFileClient } from '@/lib/utils/imageApi';
import LoadingSpinner from './LoadingSpinner';

// Form validation schema
const editImageSchema = z.object({
  alt: z.string().min(1, 'Alt text is required').max(200, 'Alt text must be less than 200 characters'),
  title: z.string().max(100, 'Title must be less than 100 characters').optional().or(z.literal('')),
  description: z.string().max(500, 'Description must be less than 500 characters').optional().or(z.literal('')),
  order: z.number().min(1, 'Order must be at least 1').max(999, 'Order must be less than 1000'),
});

type EditImageFormData = z.infer<typeof editImageSchema>;

interface ImageEditModalProps {
  image: SocialMediaImage | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (imageId: string, updates: Partial<SocialMediaImage>) => Promise<void>;
}

export default function ImageEditModal({ image, isOpen, onClose, onSave }: ImageEditModalProps) {
  const { updateImageData, replaceImageFile } = useImages();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [replaceFile, setReplaceFile] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<EditImageFormData>({
    resolver: zodResolver(editImageSchema),
  });

  // Reset form when image changes or modal opens
  useEffect(() => {
    if (image && isOpen) {
      setValue('alt', image.alt);
      setValue('title', image.title || '');
      setValue('description', image.description || '');
      setValue('order', image.order);
      setSelectedFile(null);
      setFileError(null);
      setPreviewUrl(null);
      setReplaceFile(false);
      setSubmitError(null);
    }
  }, [image, isOpen, setValue]);

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFileError(null);
    
    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    // Validate file
    const validation = validateImageFileClient(file);
    if (!validation.isValid) {
      setFileError(validation.error || 'Invalid file');
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    setSelectedFile(file);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  // Handle form submission
  const onSubmit = async (data: EditImageFormData) => {
    if (!image) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (replaceFile && selectedFile) {
        // Replace file with new file and updated metadata
        const updatedImage = await replaceImageFile(image.id, selectedFile, {
          alt: data.alt,
          title: data.title || undefined,
          description: data.description || undefined,
          order: data.order,
        });
        
        await onSave(image.id, updatedImage);
      } else {
        // Just update metadata
        const updates = {
          alt: data.alt,
          title: data.title || undefined,
          description: data.description || undefined,
          order: data.order,
        };
        
        const updatedImage = await updateImageData(image.id, updates);
        await onSave(image.id, updatedImage);
      }

      // Close modal on success
      handleClose();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to save changes');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle modal close
  const handleClose = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    reset();
    setSelectedFile(null);
    setFileError(null);
    setPreviewUrl(null);
    setReplaceFile(false);
    setSubmitError(null);
    onClose();
  };

  // Don't render if not open or no image
  if (!isOpen || !image) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={handleClose}
        />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Edit Image
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isSubmitting}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Current Image Preview */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Image
            </label>
            <div className="relative">
              <img
                src={previewUrl || image.src}
                alt={image.alt}
                className="w-full h-32 object-cover rounded-lg border border-gray-200"
              />
              {previewUrl && (
                <div className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  New
                </div>
              )}
            </div>
          </div>

          {/* File Replacement Section */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Replace Image File
              </label>
              <button
                type="button"
                onClick={() => {
                  setReplaceFile(!replaceFile);
                  if (replaceFile) {
                    // Reset file selection when canceling
                    setSelectedFile(null);
                    setFileError(null);
                    if (previewUrl) {
                      URL.revokeObjectURL(previewUrl);
                      setPreviewUrl(null);
                    }
                  }
                }}
                className="text-sm text-[#610035] hover:text-[#4a0028] font-medium"
                disabled={isSubmitting}
              >
                {replaceFile ? 'Cancel' : 'Replace File'}
              </button>
            </div>
            
            {replaceFile && (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#610035] file:text-white hover:file:bg-[#4a0028] file:cursor-pointer cursor-pointer"
                  disabled={isSubmitting}
                />
                {fileError && (
                  <p className="mt-1 text-sm text-red-600">{fileError}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Supported formats: JPEG, PNG, GIF, WebP. Maximum size: 5MB
                </p>
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Alt Text */}
            <div>
              <label htmlFor="alt" className="block text-sm font-medium text-gray-700 mb-1">
                Alt Text *
              </label>
              <input
                {...register('alt')}
                type="text"
                id="alt"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#610035] focus:border-[#610035] sm:text-sm"
                placeholder="Describe the image for accessibility"
                disabled={isSubmitting}
              />
              {errors.alt && (
                <p className="mt-1 text-sm text-red-600">{errors.alt.message}</p>
              )}
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                {...register('title')}
                type="text"
                id="title"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#610035] focus:border-[#610035] sm:text-sm"
                placeholder="Optional title for the image"
                disabled={isSubmitting}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                {...register('description')}
                id="description"
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#610035] focus:border-[#610035] sm:text-sm"
                placeholder="Optional description of the image"
                disabled={isSubmitting}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Order */}
            <div>
              <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-1">
                Display Order
              </label>
              <input
                {...register('order', { valueAsNumber: true })}
                type="number"
                id="order"
                min="1"
                max="999"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#610035] focus:border-[#610035] sm:text-sm"
                disabled={isSubmitting}
              />
              {errors.order && (
                <p className="mt-1 text-sm text-red-600">{errors.order.message}</p>
              )}
            </div>

            {/* Submit Error */}
            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{submitError}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#610035]"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#610035] hover:bg-[#4a0028] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#610035] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting || (replaceFile && !selectedFile)}
              >
                {isSubmitting && <LoadingSpinner size="sm" className="mr-2" />}
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}