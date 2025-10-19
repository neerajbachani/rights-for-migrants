import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, createSessionFromPayload, isSessionValid } from '@/lib/auth/jwt';
import { getAdminById } from '@/lib/auth/utils';
import { VerifyResponse } from '@/lib/types/auth';

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
        } as VerifyResponse,
        { status: 401 }
      );
    }

    // Verify JWT token
    const payload = await verifyToken(token);
    
    if (!payload) {
      return NextResponse.json(
        {
          success: false,
        } as VerifyResponse,
        { status: 401 }
      );
    }

    // Create session from payload
    const session = createSessionFromPayload(payload);

    // Check if session is still valid
    if (!isSessionValid(session)) {
      return NextResponse.json(
        {
          success: false,
        } as VerifyResponse,
        { status: 401 }
      );
    }

    // Get current user data
    const user = await getAdminById(session.userId);
    
    if (!user) {
      return NextResponse.json(
        {
          success: false,
        } as VerifyResponse,
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          lastLogin: user.lastLogin,
        },
      } as VerifyResponse,
      { status: 200 }
    );
  } catch (error) {
    console.error('Verify API error:', error);
    return NextResponse.json(
      {
        success: false,
      } as VerifyResponse,
      { status: 500 }
    );
  }
}