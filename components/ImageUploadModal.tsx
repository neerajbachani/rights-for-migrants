'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SocialMediaImage } from '@/lib/types/image';
import { useImages } from '@/lib/contexts/ImagesContext';
import { validateImageFile, validateImageDimensions } from '@/lib/utils/imageValidation';

// Form validation schema
const uploadFormSchema = z.object({
  alt: z.string().min(1, 'Alt text is required').max(200, 'Alt text must be less than 200 characters'),
  title: z.string().max(100, 'Title must be less than 100 characters').optional(),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
});

type UploadFormData = z.infer<typeof uploadFormSchema>;

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (image: SocialMediaImage) => void; // Will receive the uploaded image data
}

export default function ImageUploadModal({ isOpen, onClose, onUpload }: ImageUploadModalProps) {
  const { uploadNewImage } = useImages();
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fileValidationError, setFileValidationError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<UploadFormData>({
    resolver: zodResolver(uploadFormSchema),
  });

  // Handle escape key and cleanup
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isUploading) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isUploading]);

  // Cleanup preview URL when modal closes or file changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleClose = useCallback(() => {
    if (isUploading) return; // Prevent closing during upload
    
    // Cleanup
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadError(null);
    setFileValidationError(null);
    setUploadProgress(0);
    reset();
    onClose();
  }, [isUploading, previewUrl, reset, onClose]);

  const validateAndSetFile = useCallback(async (file: File) => {
    setFileValidationError(null);
    
    // Basic file validation
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setFileValidationError(validation.error || 'Invalid file');
      return false;
    }

    // Dimension validation
    try {
      const dimensionValidation = await validateImageDimensions(file);
      if (!dimensionValidation.isValid) {
        setFileValidationError(dimensionValidation.error || 'Invalid image dimensions');
        return false;
      }
    } catch (error) {
      setFileValidationError('Unable to validate image dimensions');
      return false;
    }

    // Create preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setSelectedFile(file);
    
    // Auto-generate alt text from filename if empty
    const currentAlt = watch('alt');
    if (!currentAlt) {
      const altFromFilename = file.name
        .replace(/\.[^/.]+$/, '') // Remove extension
        .replace(/[-_]/g, ' ') // Replace dashes and underscores with spaces
        .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize first letter of each word
      setValue('alt', altFromFilename);
    }

    return true;
  }, [setValue, watch]);

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    validateAndSetFile(file);
  }, [validateAndSetFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  }, [handleFileSelect]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  }, [handleFileSelect]);

  const simulateUploadProgress = useCallback(() => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90; // Stop at 90%, will complete when upload finishes
        }
        return prev + Math.random() * 15;
      });
    }, 200);
    return interval;
  }, []);

  const onSubmit = async (data: UploadFormData) => {
    if (!selectedFile) {
      setUploadError('Please select a file to upload');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    
    const progressInterval = simulateUploadProgress();

    try {
      const uploadedImage = await uploadNewImage(selectedFile, {
        alt: data.alt,
        title: data.title,
        description: data.description,
      });

      // Complete progress
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Success feedback
      setTimeout(() => {
        onUpload(uploadedImage);
        handleClose();
      }, 500);

    } catch (error) {
      clearInterval(progressInterval);
      setUploadProgress(0);
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-75 transition-opacity"
        onClick={!isUploading ? handleClose : undefined}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Upload New Image
            </h2>
            {!isUploading && (
              <button
                onClick={handleClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Content */}
          <div className="p-6 max-h-[calc(90vh-80px)] overflow-y-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* File Upload Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Image
                </label>
                
                <div
                  ref={dropZoneRef}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`
                    relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
                    ${isDragOver 
                      ? 'border-[#610035] bg-purple-50' 
                      : 'border-gray-300 hover:border-gray-400'
                    }
                    ${selectedFile ? 'border-green-300 bg-green-50' : ''}
                  `}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isUploading}
                  />
                  
                  {selectedFile ? (
                    <div className="space-y-3">
                      {previewUrl && (
                        <div className="flex justify-center">
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="max-h-32 max-w-full object-contain rounded-lg shadow-sm"
                          />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      {!isUploading && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFile(null);
                            setPreviewUrl(null);
                            setFileValidationError(null);
                            if (fileInputRef.current) {
                              fileInputRef.current.value = '';
                            }
                          }}
                          className="text-sm text-[#610035] hover:text-purple-700 font-medium"
                        >
                          Choose different file
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium text-[#610035] hover:text-purple-700">
                            Click to upload
                          </span>
                          {' '}or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF, WebP up to 5MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                {fileValidationError && (
                  <p className="mt-2 text-sm text-red-600">
                    {fileValidationError}
                  </p>
                )}
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Uploading...</span>
                    <span className="text-gray-600">{Math.round(uploadProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#610035] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Metadata Form */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="alt" className="block text-sm font-medium text-gray-700 mb-1">
                    Alt Text *
                  </label>
                  <input
                    {...register('alt')}
                    type="text"
                    id="alt"
                    disabled={isUploading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#610035] focus:border-[#610035] disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Describe the image for accessibility"
                  />
                  {errors.alt && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.alt.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title (Optional)
                  </label>
                  <input
                    {...register('title')}
                    type="text"
                    id="title"
                    disabled={isUploading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#610035] focus:border-[#610035] disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Image title"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    {...register('description')}
                    id="description"
                    rows={3}
                    disabled={isUploading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#610035] focus:border-[#610035] disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Additional description or context"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Error Message */}
              {uploadError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">
                    {uploadError}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isUploading}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#610035] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedFile || isUploading || !!fileValidationError}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#610035] border border-transparent rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#610035] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? 'Uploading...' : 'Upload Image'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}