# Database Setup Instructions

This project uses Prisma ORM with PostgreSQL for the form management system.

## Prerequisites

- Node.js installed
- PostgreSQL database (local or remote)

## Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Database (if using Prisma dev server)
```bash
npm run db:dev
```
This will start a local Prisma PostgreSQL server on ports 51213-51215.

### 3. Run Database Migration
```bash
npm run db:migrate
```
This will create the `form_submissions` table in your database.

### 4. Generate Prisma Client
```bash
npm run db:generate
```
This generates the TypeScript client for database operations.

## Database Schema

The `FormSubmission` model includes:
- `id`: Unique identifier (CUID)
- `name`: User's name
- `email`: User's email address
- `message`: User's message
- `status`: Submission status ("new", "read", "archived")
- `submittedAt`: When the form was submitted
- `createdAt`: Record creation timestamp
- `updatedAt`: Record update timestamp

## Environment Variables

Make sure your `.env` file contains:
```
DATABASE_URL="your_postgresql_connection_string"
```

## Available Scripts

- `npm run db:dev` - Start local Prisma PostgreSQL server
- `npm run db:migrate` - Run database migrations
- `npm run db:generate` - Generate Prisma client
- `npm run db:reset` - Reset database (WARNING: deletes all data)
- `npm run db:studio` - Open Prisma Studio (database GUI)

## Usage in Code

```typescript
import { prisma } from '@/lib/utils/prisma';

// Create a form submission
const submission = await prisma.formSubmission.create({
  data: {
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Hello world',
  },
});

// Get all submissions
const submissions = await prisma.formSubmission.findMany();
```