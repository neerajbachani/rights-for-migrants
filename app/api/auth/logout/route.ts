import { NextResponse } from 'next/server';
import { LogoutResponse } from '@/lib/types/auth';

export async function POST() {
  try {
    // Create response
    const response = NextResponse.json(
      {
        success: true,
      } as LogoutResponse,
      { status: 200 }
    );

    // Clear the auth token cookie
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Expire immediately
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Logout API error:', error);
    return NextResponse.json(
      {
        success: false,
      } as LogoutResponse,
      { status: 500 }
    );
  }
}