import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../../../../lib/auth/jwt';
import { DeleteResponse } from '../../../../lib/types/image';
import { readImageMetadata, saveImageMetadata, deleteImageFile } from '../../../../lib/utils/imageStorage';

// POST /api/images/bulk-delete - Delete multiple images
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

    // Validate input
    if (!Array.isArray(imageIds) || imageIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid image IDs provided' },
        { status: 400 }
      );
    }

    // Read existing images
    const images = await readImageMetadata();
    const imagesToDelete = images.filter(img => imageIds.includes(img.id));

    if (imagesToDelete.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No images found to delete' },
        { status: 404 }
      );
    }

    // Track deletion results
    const deletionResults: string[] = [];
    const failedDeletions: Array<{ id: string; filename: string; error: string }> = [];

    // Delete files from filesystem
    for (const image of imagesToDelete) {
      try {
        await deleteImageFile(image.src);
        deletionResults.push(image.id);
      } catch (error) {
        console.error(`Failed to delete file for image ${image.id}:`, error);
        failedDeletions.push({
          id: image.id,
          filename: image.filename,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    // Remove successfully deleted images from metadata
    const updatedImages = images.filter(img => !deletionResults.includes(img.id));
    await saveImageMetadata(updatedImages);

    // Prepare response
    const response: DeleteResponse & { 
      deletedCount: number; 
      failedCount: number; 
      failures?: Array<{ id: string; filename: string; error: string }> 
    } = {
      success: true,
      deletedCount: deletionResults.length,
      failedCount: failedDeletions.length
    };

    // Include failure details if any
    if (failedDeletions.length > 0) {
      response.failures = failedDeletions;
      
      // If all deletions failed, mark as unsuccessful
      if (failedDeletions.length === imagesToDelete.length) {
        response.success = false;
        response.error = `Failed to delete all ${failedDeletions.length} images`;
      } else {
        // Partial success
        response.error = `${failedDeletions.length} of ${imagesToDelete.length} images failed to delete`;
      }
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in bulk delete:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete images' },
      { status: 500 }
    );
  }
}