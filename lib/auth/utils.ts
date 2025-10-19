import { AdminUser } from '../types/auth';

// In a real application, this would be stored in a secure database
// For this implementation, we'll use a simple in-memory store
const ADMIN_CREDENTIALS = {
  email: 'admin@rightsformigrants.org',
  // In production, this should be a properly hashed password
  password: 'admin123', // This should be hashed with bcrypt
  user: {
    id: 'admin-1',
    email: 'admin@rightsformigrants.org',
    role: 'admin' as const,
    lastLogin: new Date(),
  }
};

/**
 * Validate admin credentials
 * In production, this should check against a secure database with hashed passwords
 */
export async function validateCredentials(email: string, password: string): Promise<AdminUser | null> {
  // Simulate async database lookup
  await new Promise(resolve => setTimeout(resolve, 100));

  if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    return {
      ...ADMIN_CREDENTIALS.user,
      lastLogin: new Date(),
    };
  }

  return null;
}

/**
 * Get admin user by ID
 * In production, this should query a database
 */
export async function getAdminById(userId: string): Promise<AdminUser | null> {
  if (userId === ADMIN_CREDENTIALS.user.id) {
    return ADMIN_CREDENTIALS.user;
  }
  return null;
}

/**
 * Hash password (placeholder for production implementation)
 * In production, use bcrypt or similar
 */
export async function hashPassword(password: string): Promise<string> {
  // This is a placeholder - use bcrypt in production
  return password;
}

/**
 * Verify password against hash (placeholder for production implementation)
 * In production, use bcrypt.compare
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  // This is a placeholder - use bcrypt.compare in production
  return password === hash;
}