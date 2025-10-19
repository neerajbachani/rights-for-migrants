# Form Fields Migration Guide

This guide explains how to migrate the database to support the new form fields.

## New Fields Added

The form submission system has been updated to include the following additional fields:

1. **phone** - User's phone number (required)
2. **address** - User's address (required)
3. **nationality** - User's nationality (required)
4. **visaStatus** - User's visa status (required, dropdown selection)
5. **consent** - User consent checkbox (required, boolean)

## Migration Steps

### 1. Update Prisma Schema

The `prisma/schema.prisma` file has been updated with the new fields. The FormSubmission model now includes:

```prisma
model FormSubmission {
  id          String   @id @default(cuid())
  name        String
  email       String
  phone       String
  address     String
  nationality String
  visaStatus  String
  message     String
  consent     Boolean  @default(false)
  status      String   @default("new")
  submittedAt DateTime @default(now())
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("form_submissions")
}
```

### 2. Generate Prisma Client

Run the following command to generate the updated Prisma client:

```bash
npx prisma generate
```

### 3. Create and Apply Database Migration

Create a new migration to update the database schema:

```bash
npx prisma migrate dev --name add_form_fields
```

This will:
- Create a new migration file in `prisma/migrations/`
- Apply the migration to your development database
- Update the database schema with the new columns

### 4. For Production

When deploying to production, run:

```bash
npx prisma migrate deploy
```

## Updated Components

The following files have been updated to support the new fields:

### Backend/Database
- `prisma/schema.prisma` - Database schema
- `lib/types/form.ts` - TypeScript types
- `lib/utils/formValidation.ts` - Validation logic
- `lib/utils/formDatabase.ts` - Database operations
- `app/api/forms/submit/route.ts` - API endpoint

### Frontend
- `components/cta-section.tsx` - Form UI with new fields
- `components/FormSubmissionDetail.tsx` - Detail view
- `components/FormSubmissionsTable.tsx` - Table view

## Validation Rules

The new fields have the following validation rules:

- **phone**: Required, max 20 characters
- **address**: Required, max 500 characters
- **nationality**: Required, max 100 characters
- **visaStatus**: Required, max 100 characters, dropdown selection
- **consent**: Required, must be true (checkbox must be checked)

## Visa Status Options

The visa status dropdown includes the following options:
- Citizen
- Permanent Resident
- Work Visa
- Student Visa
- Tourist Visa
- Other

## Consent Checkbox

The consent checkbox includes text:
> "I agree to the terms and conditions and consent to the collection and processing of my personal information for the purpose of joining this movement."

Users must check this box before submitting the form.

## Testing

After migration, test the following:

1. Submit a new form with all fields filled
2. Verify validation errors appear for missing fields
3. Check that consent checkbox is required
4. Verify submissions appear in the admin dashboard
5. Test the detail view shows all new fields
6. Export functionality includes new fields

## Rollback

If you need to rollback the migration:

```bash
npx prisma migrate resolve --rolled-back <migration_name>
```

Then create a new migration to remove the fields.

## Notes

- Existing form submissions in the database will need default values for the new required fields
- Consider adding a data migration script if you have existing submissions
- The consent field defaults to `false` for existing records
- Update any export functionality to include the new fields
