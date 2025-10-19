import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../../../../../lib/auth/jwt';
import { SocialMediaImage, UpdateResponse } from '../../../../../lib/types/image';
import { saveUploadedImage, readImageMetadata, saveImageMetadata, deleteImageFile } from '../../../../../lib/utils/imageStorage';
import { validateImageFile } from '../../../../../lib/utils/imageValidation';

// POST /api/images/[id]/replace - Replace image file while keeping metadata
export async function POST(
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

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const alt = formData.get('alt') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const order = formData.get('order') as string;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!alt) {
      return NextResponse.json(
        { success: false, error: 'Alt text is required' },
        { status: 400 }
      );
    }

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
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

    const existingImage = images[imageIndex];

    // Delete old file
    try {
      await deleteImageFile(existingImage.src);
    } catch (error) {
      console.warn('Failed to delete old image file:', error);
      // Continue with replacement even if old file deletion fails
    }

    // Save new file
    const savedFile = await saveUploadedImage(file);

    // Update image metadata with new file info and provided metadata
    const updatedImage: SocialMediaImage = {
      ...existingImage,
      src: savedFile.path,
      alt,
      title: title || undefined,
      description: description || undefined,
      filename: file.name,
      fileSize: file.size,
      mimeType: file.type,
      updatedAt: new Date(),
      order: order ? parseInt(order, 10) : existingImage.order
    };

    images[imageIndex] = updatedImage;
    await saveImageMetadata(images);

    const response: UpdateResponse = {
      success: true,
      image: updatedImage
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error replacing image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to replace image' },
      { status: 500 }
    );
  }
}