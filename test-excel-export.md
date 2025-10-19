# Excel Export API Test

## Prerequisites

1. Make sure the development server is running: `npm run dev`
2. Ensure you have some form submissions in the database (use the form submission tests from `test-form-api.md`)
3. Get an admin JWT token by logging in

## Get Admin JWT Token

First, login to get a JWT token:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@rightsformigrants.org",
    "password": "admin123"
  }'
```

Copy the `token` from the response and use it in the Authorization header below.

## Test Excel Export

### 1. Export All Submissions
```bash
curl -X GET "http://localhost:3000/api/admin/forms/export" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -o "form-submissions-all.xlsx"
```

### 2. Export Filtered by Status (New submissions only)
```bash
curl -X GET "http://localhost:3000/api/admin/forms/export?status=new" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -o "form-submissions-new.xlsx"
```

### 3. Export Filtered by Date Range
```bash
curl -X GET "http://localhost:3000/api/admin/forms/export?dateFrom=2024-01-01&dateTo=2024-12-31" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -o "form-submissions-2024.xlsx"
```

### 4. Export with Multiple Filters
```bash
curl -X GET "http://localhost:3000/api/admin/forms/export?status=read&dateFrom=2024-01-01" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -o "form-submissions-read-2024.xlsx"
```

## Test Error Cases

### 1. No Authentication Token
```bash
curl -X GET "http://localhost:3000/api/admin/forms/export"
```

Expected response (401):
```json
{
  "success": false,
  "error": "Authentication required"
}
```

### 2. Invalid Token
```bash
curl -X GET "http://localhost:3000/api/admin/forms/export" \
  -H "Authorization: Bearer invalid-token"
```

Expected response (401):
```json
{
  "success": false,
  "error": "Invalid or expired token"
}
```

### 3. Invalid Status Filter
```bash
curl -X GET "http://localhost:3000/api/admin/forms/export?status=invalid" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

Expected response (400):
```json
{
  "success": false,
  "error": "Invalid query parameters",
  "details": [...]
}
```

### 4. Invalid Date Format
```bash
curl -X GET "http://localhost:3000/api/admin/forms/export?dateFrom=invalid-date" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

Expected response (400):
```json
{
  "success": false,
  "error": "Invalid query parameters",
  "details": [...]
}
```

## Verify Excel File

After successful export:

1. Open the downloaded `.xlsx` file in Excel or LibreOffice Calc
2. Verify the columns are: Date, Name, Email, Message, Status
3. Check that the data matches what's in your database
4. Verify the filename format: `form-submissions-YYYY-MM-DD.xlsx`
5. Check that filtering worked correctly (if filters were applied)

## Expected Excel Format

The Excel file should contain:
- **Date**: Formatted as MM/DD/YYYY, HH:MM:SS AM/PM
- **Name**: User's full name
- **Email**: User's email address
- **Message**: User's message (may be long text)
- **Status**: Capitalized status (New, Read, Archived)

Column widths should be automatically adjusted for readability.