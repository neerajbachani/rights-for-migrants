import { SignJWT, jwtVerify } from 'jose';
import { AuthSession, AdminUser } from '../types/auth';

// JWT secret key - in production this should be from environment variables
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

const JWT_ALGORITHM = 'HS256';
const JWT_EXPIRATION = '24h'; // 24 hours

export interface CustomJWTPayload {
  userId: string;
  email: string;
  role: 'admin';
  exp?: number;
  iat?: number;
}

/**
 * Generate a JWT token for an authenticated admin user
 */
export async function generateToken(user: AdminUser): Promise<string> {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRATION)
    .sign(JWT_SECRET);

  return token;
}

/**
 * Verify and decode a JWT token
 */
export async function verifyToken(token: string): Promise<CustomJWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    // Validate that the payload has the required properties
    if (
      typeof payload === 'object' &&
      payload !== null &&
      'userId' in payload &&
      'email' in payload &&
      'role' in payload
    ) {
      return payload as unknown as CustomJWTPayload;
    }
    
    return null;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

/**
 * Create an auth session from JWT payload
 */
export function createSessionFromPayload(payload: CustomJWTPayload): AuthSession {
  const now = new Date();
  const expiresAt = new Date((payload.exp || 0) * 1000);

  return {
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
    expiresAt,
    createdAt: now,
  };
}

/**
 * Check if a session is still valid
 */
export function isSessionValid(session: AuthSession): boolean {
  return new Date() < session.expiresAt;
}

/**
 * Extract token from Authorization header
 */
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}