'use client';

import { useState } from 'react';
import { SocialMediaImage } from '@/lib/types/image';
import { useImages } from '@/lib/contexts/ImagesContext';
import ImageCard from './ImageCard';
import ImagePreviewModal from './ImagePreviewModal';
import LoadingSpinner from './LoadingSpinner';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';


interface ImageGalleryProps {
  onEdit?: (image: SocialMediaImage) => void;
  onDelete?: (imageId: string) => void;
  onBulkDelete?: (imageIds: string[]) => void;
  onUpload?: () => void;
}

export default function ImageGallery({ onEdit, onDelete, onBulkDelete, onUpload }: ImageGalleryProps) {
  // Use the global images context
  const { images, loading, error, reorderImagesByIds } = useImages();
  
  const [previewImage, setPreviewImage] = useState<SocialMediaImage | null>(null);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isDragMode, setIsDragMode] = useState(false);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = images.findIndex((image) => image.id === active.id);
      const newIndex = images.findIndex((image) => image.id === over?.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        // Create new order based on the drag operation
        const reorderedImages = arrayMove(images, oldIndex, newIndex);
        const imageIds = reorderedImages.map(img => img.id);
        
        try {
          await reorderImagesByIds(imageIds);
        } catch (error) {
          console.error('Failed to reorder images:', error);
        }
      }
    }
  };

  // Handle image preview
  const handlePreview = (image: SocialMediaImage) => {
    setPreviewImage(image);
  };

  // Handle edit action
  const handleEdit = (image: SocialMediaImage) => {
    if (onEdit) {
      onEdit(image);
    }
  };

  // Handle delete action
  const handleDelete = (imageId: string) => {
    if (onDelete) {
      onDelete(imageId);
    }
  };

  // Handle image selection
  const handleImageSelect = (imageId: string, selected: boolean) => {
    const newSelection = new Set(selectedImages);
    if (selected) {
      newSelection.add(imageId);
    } else {
      newSelection.delete(imageId);
    }
    setSelectedImages(newSelection);
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedImages.size === images.length) {
      setSelectedImages(new Set());
    } else {
      setSelectedImages(new Set(images.map(img => img.id)));
    }
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (onBulkDelete && selectedImages.size > 0) {
      onBulkDelete(Array.from(selectedImages));
    }
  };

  // Exit selection mode
  const exitSelectionMode = () => {
    setIsSelectionMode(false);
    setSelectedImages(new Set());
  };

  // Enter selection mode
  const enterSelectionMode = () => {
    setIsSelectionMode(true);
  };

  // Toggle drag mode
  const toggleDragMode = () => {
    setIsDragMode(!isDragMode);
    if (isSelectionMode) {
      exitSelectionMode();
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-gray-600">Loading images...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
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
          <h3 className="ml-3 text-sm font-medium text-red-800">
            Error loading images
          </h3>
        </div>
        <div className="mt-2 text-sm text-red-700">
          {error}
        </div>
        <div className="mt-4">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100">
          <svg
            className="h-8 w-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          No images uploaded yet
        </h3>
        <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
          Get started by uploading your first social media image. Images will appear here once uploaded.
        </p>
        {onUpload && (
          <div className="mt-6">
            <button
              onClick={onUpload}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#610035] hover:bg-[#4a0028] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#610035]"
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Upload First Image
            </button>
          </div>
        )}
      </div>
    );
  }

  // Gallery with images
  return (
    <div>
      {/* Gallery Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900">
            Social Media Images
          </h2>
          <p className="text-sm text-gray-500">
            {isSelectionMode && selectedImages.size > 0 
              ? `${selectedImages.size} of ${images.length} selected`
              : isDragMode
              ? 'Drag and drop to reorder images'
              : `${images.length} ${images.length === 1 ? 'image' : 'images'} uploaded`
            }
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {isSelectionMode ? (
            <>
              {/* Selection Mode Actions */}
              <button
                onClick={handleSelectAll}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#610035]"
              >
                {selectedImages.size === images.length ? 'Deselect All' : 'Select All'}
              </button>
              
              {selectedImages.size > 0 && onBulkDelete && (
                <button
                  onClick={handleBulkDelete}
                  className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <svg
                    className="mr-2 h-4 w-4"
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
                  Delete {selectedImages.size}
                </button>
              )}
              
              <button
                onClick={exitSelectionMode}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#610035]"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              {/* Normal Mode Actions */}
              {images.length > 1 && (
                <button
                  onClick={toggleDragMode}
                  className={`inline-flex items-center px-3 py-2 border shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#610035] ${
                    isDragMode
                      ? 'border-[#610035] text-[#610035] bg-purple-50 hover:bg-purple-100'
                      : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                  }`}
                >
                  <svg
                    className="mr-2 h-4 w-4"
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
                  {isDragMode ? 'Done Reordering' : 'Reorder'}
                </button>
              )}
              
              {images.length > 0 && !isDragMode && (
                <button
                  onClick={enterSelectionMode}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#610035]"
                >
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Select
                </button>
              )}
              
              {onUpload && !isDragMode && (
                <button
                  onClick={onUpload}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#610035] hover:bg-[#4a0028] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#610035]"
                >
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Upload Image
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Responsive Grid */}
      {isDragMode ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={images.map(img => img.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {images.map((image) => (
                <ImageCard
                  key={image.id}
                  image={image}
                  onPreview={handlePreview}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  isSelectionMode={isSelectionMode}
                  isSelected={selectedImages.has(image.id)}
                  onSelect={handleImageSelect}
                  isDragMode={isDragMode}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {images.map((image) => (
            <ImageCard
              key={image.id}
              image={image}
              onPreview={handlePreview}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isSelectionMode={isSelectionMode}
              isSelected={selectedImages.has(image.id)}
              onSelect={handleImageSelect}
              isDragMode={isDragMode}
            />
          ))}
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <ImagePreviewModal
          image={previewImage}
          isOpen={!!previewImage}
          onClose={() => setPreviewImage(null)}
        />
      )}
    </div>
  );
}