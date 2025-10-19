# Form Hooks Testing

This document describes how to test the TanStack Query hooks for form operations.

## Hooks Created

### 1. useSubmitForm
- **Location**: `lib/hooks/useSubmitForm.ts`
- **Purpose**: Handle form submission from the CTA section
- **Features**: Loading states, error handling, success states, form reset

### 2. useFormSubmissions
- **Location**: `lib/hooks/admin/useFormSubmissions.ts`
- **Purpose**: Fetch form submissions with pagination and filtering
- **Features**: Caching, pagination, filtering by status and date range

### 3. useUpdateSubmissionStatus
- **Location**: `lib/hooks/admin/useUpdateSubmissionStatus.ts`
- **Purpose**: Update submission status (new, read, archived)
- **Features**: Optimistic updates, cache invalidation, error rollback

### 4. useDeleteSubmission
- **Location**: `lib/hooks/admin/useDeleteSubmission.ts`
- **Purpose**: Delete individual submissions
- **Features**: Optimistic updates, cache invalidation, error rollback

### 5. useExportSubmissions
- **Location**: `lib/hooks/admin/useExportSubmissions.ts`
- **Purpose**: Export submissions to Excel
- **Features**: File download handling, loading states, filtering support

### 6. useBulkOperations
- **Location**: `lib/hooks/admin/useBulkOperations.ts`
- **Purpose**: Handle bulk delete and status updates
- **Features**: Optimistic updates, cache invalidation, error rollback

## QueryClient Provider

- **Location**: `lib/contexts/QueryProvider.tsx`
- **Added to**: `app/layout.tsx`
- **Features**: 
  - Default caching configuration
  - Retry logic for failed requests
  - React Query DevTools integration

## Usage Examples

### Form Submission
```typescript
import { useSubmitForm } from '@/lib/hooks';

function ContactForm() {
  const { submitForm, isLoading, error, isSuccess, reset } = useSubmitForm();
  
  const handleSubmit = async (data) => {
    try {
      await submitForm(data);
      // Handle success
    } catch (error) {
      // Handle error
    }
  };
}
```

### Admin Form Management
```typescript
import { 
  useFormSubmissions, 
  useUpdateSubmissionStatus, 
  useDeleteSubmission 
} from '@/lib/hooks';

function AdminPanel() {
  const { submissions, isLoading, pagination } = useFormSubmissions({
    page: 1,
    limit: 10,
    status: 'new'
  });
  
  const { updateStatus } = useUpdateSubmissionStatus();
  const { deleteSubmission } = useDeleteSubmission();
}
```

## Testing Checklist

- [x] All hooks created with proper TypeScript types
- [x] QueryClient provider added to app layout
- [x] TanStack Query dependencies installed
- [x] Optimistic updates implemented for mutations
- [x] Error handling and rollback logic
- [x] Cache invalidation strategies
- [x] File download handling for exports
- [x] Proper authentication token handling
- [x] TypeScript compilation passes without errors

## Next Steps

The hooks are ready for integration with UI components. The next tasks in the implementation plan are:

6. Build admin UI components for form management
7. Integrate form submission with CTA section
8. Update admin dashboard with form management section

All hooks follow the requirements specified in the design document and provide the necessary functionality for form operations with proper loading states, error handling, and optimistic updates.