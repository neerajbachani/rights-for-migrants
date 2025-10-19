# Form Submission API Test

## Test the API endpoint manually

Make sure the development server is running with `npm run dev`, then test these curl commands:

### 1. Valid Form Submission
```bash
curl -X POST http://localhost:3000/api/forms/submit \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com", 
    "message": "This is a test message for the form submission."
  }'
```

Expected response (201):
```json
{
  "success": true,
  "message": "Thank you for your submission! We will get back to you soon."
}
```

### 2. Invalid Email Format
```bash
curl -X POST http://localhost:3000/api/forms/submit \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "invalid-email",
    "message": "This is a test message."
  }'
```

Expected response (400):
```json
{
  "success": false,
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 3. Missing Required Fields
```bash
curl -X POST http://localhost:3000/api/forms/submit \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe"
  }'
```

Expected response (400):
```json
{
  "success": false,
  "error": "Validation failed", 
  "code": "VALIDATION_ERROR",
  "details": [
    {
      "field": "email",
      "message": "Email is required"
    },
    {
      "field": "message", 
      "message": "Message is required"
    }
  ]
}
```

### 4. Rate Limiting Test
Run the valid submission curl command 6 times rapidly. The 6th request should return:

Expected response (429):
```json
{
  "success": false,
  "error": "Too many form submissions. Please try again after [time].",
  "code": "RATE_LIMIT_EXCEEDED"
}
```

### 5. Invalid JSON
```bash
curl -X POST http://localhost:3000/api/forms/submit \
  -H "Content-Type: application/json" \
  -d 'invalid json'
```

Expected response (400):
```json
{
  "success": false,
  "error": "Invalid JSON format",
  "code": "INVALID_JSON"
}
```

### 6. Unsupported Method
```bash
curl -X GET http://localhost:3000/api/forms/submit
```

Expected response (405):
```json
{
  "success": false,
  "error": "Method not allowed",
  "code": "METHOD_NOT_ALLOWED"
}
```

## Verify Database Storage

After successful submissions, check the database:

```bash
npx prisma studio
```

Or query directly:
```sql
SELECT * FROM form_submissions ORDER BY "submittedAt" DESC;
```