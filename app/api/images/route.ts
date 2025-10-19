import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../../../lib/auth/jwt';
import { SocialMediaImage, ImagesResponse } from '../../../lib/types/image';
import { readImageMetadata, saveImageMetadata } from '../../../lib/utils/imageStorage';

// GET /api/images - Retrieve all images
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    // const token = request.cookies.get('auth-token')?.value;
    // if (!token) {
    //   return NextResponse.json(
    //     { success: false, error: 'Authentication required' },
    //     { status: 401 }
    //   );
    // }

    // const payload = await verifyToken(token);
    // if (!payload) {
    //   return NextResponse.json(
    //     { success: false, error: 'Invalid token' },
    //     { status: 401 }
    //   );
    // }

    // Read images from storage
    const images = await readImageMetadata();
    
    const response: ImagesResponse = {
      success: true,
      images: images.sort((a, b) => a.order - b.order)
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}