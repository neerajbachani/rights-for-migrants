'use client';

import { useState } from 'react';
import { SocialMediaImage } from '@/lib/types/image';
import { formatFileSize, formatDate } from '@/lib/utils';

interface DeleteConfirmationDialogProps {
  image: SocialMediaImage | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (imageId: string) => Promise<void>;
  isDeleting?: boolean;
}

export default function DeleteConfirmationDialog({
  image,
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false
}: DeleteConfirmationDialogProps) {
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !image) return null;

  const handleConfirm = async () => {
    try {
      setError(null);
      await onConfirm(image.id);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete image');
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      setError(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={handleClose}
        />

        {/* Dialog */}
        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          {/* Header */}
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left flex-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Delete Image
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this image? This action cannot be undone.
                </p>
              </div>
            </div>
          </div>

          {/* Image Preview */}
          <div className="mt-4 bg-gray-50 rounded-lg p-4">
            <div className="flex items-start space-x-4">
              {/* Image Thumbnail */}
              <div className="flex-shrink-0">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="h-20 w-20 object-cover rounded-lg border border-gray-200"
                />
              </div>
              
              {/* Image Details */}
              <div className="flex-1 min-w-0">
                {image.title && (
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {image.title}
                  </h4>
                )}
                <p className="text-sm text-gray-600 truncate mt-1">
                  {image.alt}
                </p>
                {image.description && (
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {image.description}
                  </p>
                )}
                <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                  <span className="truncate">{image.filename}</span>
                  <span>•</span>
                  <span>{formatFileSize(image.fileSize)}</span>
                  <span>•</span>
                  <span>Uploaded {formatDate(image.uploadedAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-3">
              <div className="flex">
                <svg
                  className="h-5 w-5 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Deletion Failed
                  </h3>
                  <div className="mt-1 text-sm text-red-700">
                    {error}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isDeleting}
              className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto"
            >
              {isDeleting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Deleting...
                </>
              ) : (
                'Delete Image'
              )}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={isDeleting}
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed sm:mt-0 sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}