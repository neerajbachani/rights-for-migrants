'use client';

import { useEffect } from 'react';
import { SocialMediaImage } from '@/lib/types/image';
import { formatFileSize, formatDate } from '@/lib/utils';

interface ImagePreviewModalProps {
  image: SocialMediaImage;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImagePreviewModal({ image, isOpen, onClose }: ImagePreviewModalProps) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-75 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-medium text-gray-900 truncate">
                {image.title || image.filename}
              </h2>
              <p className="text-sm text-gray-500 truncate">
                {image.alt}
              </p>
            </div>
            <button
              onClick={onClose}
              className="ml-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
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
          </div>

          {/* Content */}
          <div className="flex flex-col lg:flex-row max-h-[calc(90vh-80px)]">
            {/* Image */}
            <div className="flex-1 flex items-center justify-center bg-gray-50 p-4 lg:p-8">
              <img
                src={image.src}
                alt={image.alt}
                className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
              />
            </div>

            {/* Metadata Panel */}
            <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-gray-200 bg-gray-50 p-4 overflow-y-auto">
              <h3 className="text-sm font-medium text-gray-900 mb-4">
                Image Details
              </h3>

              <div className="space-y-4">
                {/* Basic Info */}
                <div>
                  <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Filename
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 break-all">
                    {image.filename}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Alt Text
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {image.alt}
                  </dd>
                </div>

                {image.title && (
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Title
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {image.title}
                    </dd>
                  </div>
                )}

                {image.description && (
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Description
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {image.description}
                    </dd>
                  </div>
                )}

                {/* Technical Info */}
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                    Technical Details
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <dt className="text-xs text-gray-500">File Size</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {formatFileSize(image.fileSize)}
                      </dd>
                    </div>
                    
                    <div>
                      <dt className="text-xs text-gray-500">Type</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {image.mimeType}
                      </dd>
                    </div>
                    
                    <div>
                      <dt className="text-xs text-gray-500">Order</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {image.order}
                      </dd>
                    </div>
                    
                    <div>
                      <dt className="text-xs text-gray-500">ID</dt>
                      <dd className="text-sm font-mono text-gray-900 truncate" title={image.id}>
                        {image.id.slice(0, 8)}...
                      </dd>
                    </div>
                  </div>
                </div>

                {/* Timestamps */}
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                    Timestamps
                  </h4>
                  
                  <div className="space-y-2">
                    <div>
                      <dt className="text-xs text-gray-500">Uploaded</dt>
                      <dd className="text-sm text-gray-900">
                        {formatDate(image.uploadedAt, true)}
                      </dd>
                    </div>
                    
                    <div>
                      <dt className="text-xs text-gray-500">Last Updated</dt>
                      <dd className="text-sm text-gray-900">
                        {formatDate(image.updatedAt, true)}
                      </dd>
                    </div>
                  </div>
                </div>

                {/* File Path */}
                <div className="border-t border-gray-200 pt-4">
                  <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    File Path
                  </dt>
                  <dd className="mt-1 text-xs font-mono text-gray-600 bg-gray-100 p-2 rounded break-all">
                    {image.src}
                  </dd>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}