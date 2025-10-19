import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../../../../lib/auth/jwt';
import { reorderImages } from '../../../../lib/utils/imageOrdering';
import { ImagesResponse } from '../../../../lib/types/image';

// POST /api/images/reorder - Reorder images
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

    const { imageIds } = await request.json();

    if (!Array.isArray(imageIds)) {
      return NextResponse.json(
        { success: false, error: 'imageIds must be an array' },
        { status: 400 }
      );
    }

    if (imageIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'imageIds array cannot be empty' },
        { status: 400 }
      );
    }

    // Reorder images
    const reorderedImages = await reorderImages(imageIds);

    const response: ImagesResponse = {
      success: true,
      images: reorderedImages
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error reordering images:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reorder images' },
      { status: 500 }
    );
  }
}