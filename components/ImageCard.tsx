'use client';

import { SocialMediaImage } from '@/lib/types/image';
import { formatFileSize, formatDate } from '@/lib/utils';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ImageCardProps {
  image: SocialMediaImage;
  onPreview: (image: SocialMediaImage) => void;
  onEdit: (image: SocialMediaImage) => void;
  onDelete: (imageId: string) => void;
  isSelectionMode?: boolean;
  isSelected?: boolean;
  onSelect?: (imageId: string, selected: boolean) => void;
  isDragMode?: boolean;
}

export default function ImageCard({ 
  image, 
  onPreview, 
  onEdit, 
  onDelete, 
  isSelectionMode = false, 
  isSelected = false, 
  onSelect,
  isDragMode = false
}: ImageCardProps) {
  
  // Drag and drop functionality
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id, disabled: !isDragMode });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  const handleCardClick = () => {
    if (isDragMode) return; // Disable clicks in drag mode
    if (isSelectionMode && onSelect) {
      onSelect(image.id, !isSelected);
    } else {
      onPreview(image);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(image.id, e.target.checked);
    }
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      {...(isDragMode ? { ...attributes, ...listeners } : {})}
      className={`bg-white rounded-lg shadow-sm border overflow-hidden transition-all duration-200 ${
        isDragMode 
          ? isDragging
            ? 'shadow-lg scale-105 rotate-2 z-50 cursor-grabbing'
            : 'hover:shadow-md cursor-grab'
          : isSelectionMode 
            ? isSelected 
              ? 'border-[#610035] ring-2 ring-[#610035] ring-opacity-50 hover:shadow-md' 
              : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
            : 'border-gray-200 hover:shadow-md'
      } ${isDragging ? 'opacity-50' : ''}`}>
      {/* Image Preview */}
      <div className="aspect-square relative bg-gray-100">
        <img
          src={image.src}
          alt={image.alt}
          className={`w-full h-full object-cover transition-opacity ${
            isDragMode 
              ? 'cursor-grab' 
              : isSelectionMode 
                ? 'cursor-pointer' 
                : 'cursor-pointer hover:opacity-90'
          }`}
          onClick={handleCardClick}
          loading="lazy"
        />
        
        {/* Selection Checkbox */}
        {isSelectionMode && (
          <div className="absolute top-2 left-2">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={handleCheckboxChange}
              className="h-5 w-5 text-[#610035] focus:ring-[#610035] border-gray-300 rounded"
            />
          </div>
        )}
        
        {/* Drag Mode Indicator */}
        {isDragMode && (
          <div className="absolute top-2 right-2">
            <div className="bg-[#610035] text-white p-1 rounded-full shadow-lg">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
            </div>
          </div>
        )}

        {/* Overlay with actions - only show in normal mode */}
        {!isSelectionMode && !isDragMode && (
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
            <div className="flex space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPreview(image);
                }}
                className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                title="Preview image"
              >
                <svg
                  className="h-4 w-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(image);
                }}
                className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                title="Edit image"
              >
                <svg
                  className="h-4 w-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(image.id);
                }}
                className="p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors"
                title="Delete image"
              >
                <svg
                  className="h-4 w-4 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Image Metadata */}
      <div className="p-4">
        {/* Title and Alt Text */}
        <div className="mb-2">
          {image.title && (
            <h3 className="text-sm font-medium text-gray-900 truncate mb-1">
              {image.title}
            </h3>
          )}
          <p className="text-xs text-gray-600 truncate" title={image.alt}>
            {image.alt}
          </p>
        </div>

        {/* Description */}
        {image.description && (
          <p className="text-xs text-gray-500 mb-3 overflow-hidden" title={image.description}>
            <span className="block truncate">
              {image.description.length > 60 ? `${image.description.slice(0, 60)}...` : image.description}
            </span>
          </p>
        )}

        {/* File Info */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-2">
            <span className="truncate max-w-20" title={image.filename}>
              {image.filename}
            </span>
            <span>•</span>
            <span>{formatFileSize(image.fileSize)}</span>
          </div>
        </div>

        {/* Upload Date */}
        <div className="mt-2 text-xs text-gray-400">
          Uploaded {formatDate(image.uploadedAt)}
        </div>

        {/* Order Badge */}
        <div className="mt-2 flex justify-between items-center">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Order: {image.order}
          </span>
          
          {/* MIME Type Badge */}
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {image.mimeType.split('/')[1].toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
}