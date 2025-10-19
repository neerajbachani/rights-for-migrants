import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../../../../lib/auth/jwt';
import { SocialMediaImage, UploadResponse } from '../../../../lib/types/image';
import { saveUploadedImage, readImageMetadata, saveImageMetadata } from '../../../../lib/utils/imageStorage';
import { validateImageFile } from '../../../../lib/utils/imageValidation';

// POST /api/images/upload - Upload new image
export async function POST(request: NextRequest) {
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

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const alt = formData.get('alt') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;

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

    // Save file and create metadata
    const savedFile = await saveUploadedImage(file);
    const existingImages = await readImageMetadata();
    const maxOrder = existingImages.length > 0 ? Math.max(...existingImages.map(img => img.order)) : 0;

    const newImage: SocialMediaImage = {
      id: crypto.randomUUID(),
      src: savedFile.path,
      alt,
      title: title || undefined,
      description: description || undefined,
      filename: file.name,
      fileSize: file.size,
      mimeType: file.type,
      uploadedAt: new Date(),
      updatedAt: new Date(),
      order: maxOrder + 1
    };

    // Save metadata
    const updatedImages = [...existingImages, newImage];
    await saveImageMetadata(updatedImages);

    const response: UploadResponse = {
      success: true,
      image: newImage
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}