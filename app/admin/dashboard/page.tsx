'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useImages } from '@/lib/contexts/ImagesContext';
import AdminRoute from '@/components/AdminRoute';
import DashboardLayout from '@/components/DashboardLayout';
import ImageGallery from '@/components/ImageGallery';
import ImageUploadModal from '@/components/ImageUploadModal';
import ImageEditModal from '@/components/ImageEditModal';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import BulkDeleteConfirmationDialog from '@/components/BulkDeleteConfirmationDialog';
import { SocialMediaImage } from '@/lib/types/image';

function DashboardContent() {
  const { user } = useAuth();
  const { images, uploadNewImage, updateImageData, deleteImageById, bulkDeleteImagesByIds } = useImages();
  
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<SocialMediaImage | null>(null);
  
  // Deletion states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingImage, setDeletingImage] = useState<SocialMediaImage | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Bulk deletion states
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [bulkDeletingImages, setBulkDeletingImages] = useState<SocialMediaImage[]>([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  
  // Toast/feedback states
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Handle edit image
  const handleEdit = (image: SocialMediaImage) => {
    setEditingImage(image);
    setIsEditModalOpen(true);
  };

  // Handle single image deletion
  const handleDelete = async (imageId: string) => {
    // Find the image to show in confirmation dialog
    const imageToDelete = images.find(img => img.id === imageId);
    
    if (imageToDelete) {
      setDeletingImage(imageToDelete);
      setIsDeleteModalOpen(true);
    } else {
      setFeedback({
        type: 'error',
        message: 'Image not found'
      });
    }
  };

  // Confirm single image deletion
  const handleConfirmDelete = async (imageId: string) => {
    try {
      setIsDeleting(true);
      await deleteImageById(imageId);
      
      setFeedback({
        type: 'success',
        message: 'Image deleted successfully'
      });
      
      // Close modal
      setIsDeleteModalOpen(false);
      setDeletingImage(null);
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to delete image'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle bulk deletion
  const handleBulkDelete = async (imageIds: string[]) => {
    // Find the images to show in confirmation dialog
    const imagesToDelete = images.filter(img => imageIds.includes(img.id));
    
    if (imagesToDelete.length > 0) {
      setBulkDeletingImages(imagesToDelete);
      setIsBulkDeleteModalOpen(true);
    } else {
      setFeedback({
        type: 'error',
        message: 'No images found to delete'
      });
    }
  };

  // Confirm bulk deletion
  const handleConfirmBulkDelete = async (imageIds: string[]) => {
    try {
      setIsBulkDeleting(true);
      const result = await bulkDeleteImagesByIds(imageIds);
      
      if (result.failedCount > 0) {
        setFeedback({
          type: 'error',
          message: `${result.deletedCount} images deleted, ${result.failedCount} failed`
        });
      } else {
        setFeedback({
          type: 'success',
          message: `${result.deletedCount} images deleted successfully`
        });
      }
      
      // Close modal
      setIsBulkDeleteModalOpen(false);
      setBulkDeletingImages([]);
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to delete images'
      });
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const handleUpload = () => {
    setIsUploadModalOpen(true);
  };

  const handleUploadComplete = (image: SocialMediaImage) => {
    console.log('Image uploaded successfully:', image);
    setFeedback({
      type: 'success',
      message: 'Image uploaded successfully'
    });
  };

  // Handle edit save
  const handleEditSave = async (imageId: string, updates: Partial<SocialMediaImage>) => {
    console.log('Image updated successfully:', imageId, updates);
    setFeedback({
      type: 'success',
      message: 'Image updated successfully'
    });
  };

  // Handle edit modal close
  const handleEditClose = () => {
    setIsEditModalOpen(false);
    setEditingImage(null);
  };

  // Handle delete modal close
  const handleDeleteClose = () => {
    if (!isDeleting) {
      setIsDeleteModalOpen(false);
      setDeletingImage(null);
    }
  };

  // Handle bulk delete modal close
  const handleBulkDeleteClose = () => {
    if (!isBulkDeleting) {
      setIsBulkDeleteModalOpen(false);
      setBulkDeletingImages([]);
    }
  };

  // Clear feedback after 5 seconds
  useState(() => {
    if (feedback) {
      const timer = setTimeout(() => {
        setFeedback(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  });

  return (
    <DashboardLayout
      title="Image Management"
      subtitle={`Welcome back, ${user?.email}`}
    >
      {/* Feedback Toast */}
      {feedback && (
        <div className={`mb-4 p-4 rounded-md ${
          feedback.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          <div className="flex">
            <svg
              className={`h-5 w-5 ${feedback.type === 'success' ? 'text-green-400' : 'text-red-400'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {feedback.type === 'success' ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              )}
            </svg>
            <div className="ml-3">
              <p className="text-sm font-medium">{feedback.message}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setFeedback(null)}
                className={`inline-flex rounded-md p-1.5 ${
                  feedback.type === 'success'
                    ? 'text-green-500 hover:bg-green-100'
                    : 'text-red-500 hover:bg-red-100'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  feedback.type === 'success' ? 'focus:ring-green-600' : 'focus:ring-red-600'
                }`}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Gallery */}
      <div className="bg-white shadow rounded-lg p-6">
        <ImageGallery
          onEdit={handleEdit}
          onDelete={handleDelete}
          onBulkDelete={handleBulkDelete}
          onUpload={handleUpload}
        />
      </div>

      {/* Upload Modal */}
      <ImageUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUploadComplete}
      />

      {/* Edit Modal */}
      <ImageEditModal
        image={editingImage}
        isOpen={isEditModalOpen}
        onClose={handleEditClose}
        onSave={handleEditSave}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationDialog
        image={deletingImage}
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteClose}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />

      {/* Bulk Delete Confirmation Modal */}
      <BulkDeleteConfirmationDialog
        images={bulkDeletingImages}
        isOpen={isBulkDeleteModalOpen}
        onClose={handleBulkDeleteClose}
        onConfirm={handleConfirmBulkDelete}
        isDeleting={isBulkDeleting}
      />
    </DashboardLayout>
  );
}

export default function AdminDashboardPage() {
  return (
    <AdminRoute>
      <DashboardContent />
    </AdminRoute>
  );
}