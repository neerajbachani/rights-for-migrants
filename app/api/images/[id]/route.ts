import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../../../../lib/auth/jwt';
import { SocialMediaImage, UpdateResponse, DeleteResponse } from '../../../../lib/types/image';
import { readImageMetadata, saveImageMetadata, deleteImageFile } from '../../../../lib/utils/imageStorage';

// PUT /api/images/[id] - Update image metadata
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const updateData = await request.json();

    // Validate required fields
    if (updateData.alt !== undefined && !updateData.alt.trim()) {
      return NextResponse.json(
        { success: false, error: 'Alt text cannot be empty' },
        { status: 400 }
      );
    }

    // Read existing images
    const images = await readImageMetadata();
    const imageIndex = images.findIndex(img => img.id === id);

    if (imageIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Image not found' },
        { status: 404 }
      );
    }

    // Update image metadata
    const updatedImage: SocialMediaImage = {
      ...images[imageIndex],
      ...updateData,
      updatedAt: new Date()
    };

    images[imageIndex] = updatedImage;
    await saveImageMetadata(images);

    const response: UpdateResponse = {
      success: true,
      image: updatedImage
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update image' },
      { status: 500 }
    );
  }
}

// DELETE /api/images/[id] - Delete image
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Read existing images
    const images = await readImageMetadata();
    const imageToDelete = images.find(img => img.id === id);

    if (!imageToDelete) {
      return NextResponse.json(
        { success: false, error: 'Image not found' },
        { status: 404 }
      );
    }

    // Delete file from filesystem
    await deleteImageFile(imageToDelete.src);

    // Remove from metadata
    const updatedImages = images.filter(img => img.id !== id);
    await saveImageMetadata(updatedImages);

    const response: DeleteResponse = {
      success: true
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}