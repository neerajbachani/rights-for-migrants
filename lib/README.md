# Authentication Infrastructure

This directory contains the authentication infrastructure and data models for the admin login dashboard.

## Structure

### Types (`/types`)
- `auth.ts` - Authentication related interfaces and types
- `image.ts` - Image management interfaces and types  
- `api.ts` - Common API response types and error handling
- `index.ts` - Exports all types for easy importing

### Authentication (`/auth`)
- `jwt.ts` - JWT token generation, verification, and utilities
- `utils.ts` - Authentication helper functions and credential validation
- `index.ts` - Exports all authentication utilities

### Contexts (`/contexts`)
- `AuthContext.tsx` - React context provider for authentication state management

## Key Features

1. **TypeScript Interfaces**: Complete type definitions for authentication and image management
2. **JWT Utilities**: Secure token generation and verification using the `jose` library
3. **Authentication Context**: React context for managing authentication state across the application
4. **Credential Validation**: Helper functions for validating admin credentials

## Usage

```typescript
// Import types
import { AdminUser, SocialMediaImage } from '@/lib/types';

// Import authentication utilities
import { generateToken, verifyToken, useAuth } from '@/lib/auth';

// Use authentication context
const { user, login, logout, isAuthenticated } = useAuth();
```

## Security Notes

- JWT tokens expire after 24 hours
- Credentials are validated against a simple in-memory store (should be replaced with secure database in production)
- Password hashing is placeholder implementation (should use bcrypt in production)
- All authentication operations include proper error handling