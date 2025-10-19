import { NextRequest, NextResponse } from 'next/server';
import { readImageMetadata } from '../../../../lib/utils/imageStorage';

// GET /api/images/health - Check image management system health
export async function GET(request: NextRequest) {
  try {
    // Test reading metadata
    const images = await readImageMetadata();
    
    return NextResponse.json({
      success: true,
      status: 'healthy',
      imageCount: images.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      {
        success: false,
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}