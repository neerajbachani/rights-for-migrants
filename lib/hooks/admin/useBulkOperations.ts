"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormSubmission, BulkOperationRequest, FormSubmissionStatus } from '@/lib/types/form';

interface UseBulkOperationsReturn {
  bulkDelete: (submissionIds: string[]) => Promise<void>;
  bulkUpdateStatus: (submissionIds: string[], status: FormSubmissionStatus) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function useBulkOperations(): UseBulkOperationsReturn {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (request: BulkOperationRequest): Promise<void> => {
      const response = await fetch('/api/admin/forms/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
    },
    onMutate: async (request) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['formSubmissions'] });

      // Snapshot the previous value
      const previousSubmissions = queryClient.getQueriesData({ queryKey: ['formSubmissions'] });

      // Optimistically update based on operation type
      queryClient.setQueriesData(
        { queryKey: ['formSubmissions'] },
        (old: any) => {
          if (!old?.submissions) return old;
          
          if (request.action === 'delete') {
            return {
              ...old,
              submissions: old.submissions.filter(
                (submission: FormSubmission) => !request.submissionIds.includes(submission.id)
              ),
              pagination: {
                ...old.pagination,
                total: Math.max(0, old.pagination.total - request.submissionIds.length),
              },
            };
          } else if (request.action === 'updateStatus' && request.status) {
            return {
              ...old,
              submissions: old.submissions.map((submission: FormSubmission) =>
                request.submissionIds.includes(submission.id)
                  ? { ...submission, status: request.status }
                  : submission
              ),
            };
          }
          
          return old;
        }
      );

      // Return a context object with the snapshotted value
      return { previousSubmissions };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousSubmissions) {
        context.previousSubmissions.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['formSubmissions'] });
    },
  });

  return {
    bulkDelete: (submissionIds: string[]) =>
      mutation.mutateAsync({ action: 'delete', submissionIds }),
    bulkUpdateStatus: (submissionIds: string[], status: FormSubmissionStatus) =>
      mutation.mutateAsync({ action: 'updateStatus', submissionIds, status }),
    isLoading: mutation.isPending,
    error: mutation.error?.message || null,
  };
}