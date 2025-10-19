import { NextRequest, NextResponse } from 'next/server';
import { validateCredentials } from '@/lib/auth/utils';
import { generateToken } from '@/lib/auth/jwt';
import { LoginRequest, LoginResponse } from '@/lib/types/auth';
import { checkRateLimit, recordFailedAttempt, resetRateLimit, getClientIP } from '@/lib/auth/middleware';

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);
    
    // Check rate limiting
    const rateLimitResult = checkRateLimit(clientIP);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many login attempts. Please try again after ${rateLimitResult.blockedUntil?.toLocaleTimeString()}.`,
        } as LoginResponse,
        { status: 429 }
      );
    }

    const body: LoginRequest = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      recordFailedAttempt(clientIP);
      return NextResponse.json(
        {
          success: false,
          error: 'Email and password are required',
        } as LoginResponse,
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      recordFailedAttempt(clientIP);
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email format',
        } as LoginResponse,
        { status: 400 }
      );
    }

    // Validate credentials
    const user = await validateCredentials(email, password);
    
    if (!user) {
      recordFailedAttempt(clientIP);
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email or password',
        } as LoginResponse,
        { status: 401 }
      );
    }

    // Reset rate limit on successful login
    resetRateLimit(clientIP);

    // Generate JWT token
    const token = await generateToken(user);

    // Create response with user data
    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          lastLogin: user.lastLogin,
        },
      } as LoginResponse,
      { status: 200 }
    );

    // Set HTTP-only cookie with JWT token
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours in seconds
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      } as LoginResponse,
      { status: 500 }
    );
  }
}