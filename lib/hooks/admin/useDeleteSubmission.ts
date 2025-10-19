"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormSubmission } from '@/lib/types/form';

interface UseDeleteSubmissionReturn {
  deleteSubmission: (id: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function useDeleteSubmission(): UseDeleteSubmissionReturn {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const response = await fetch(`/api/admin/forms/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
    },
    onMutate: async (id) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['formSubmissions'] });

      // Snapshot the previous value
      const previousSubmissions = queryClient.getQueriesData({ queryKey: ['formSubmissions'] });

      // Optimistically update to the new value
      queryClient.setQueriesData(
        { queryKey: ['formSubmissions'] },
        (old: any) => {
          if (!old?.submissions) return old;
          
          return {
            ...old,
            submissions: old.submissions.filter((submission: FormSubmission) => submission.id !== id),
            pagination: {
              ...old.pagination,
              total: Math.max(0, old.pagination.total - 1),
            },
          };
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
    deleteSubmission: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error?.message || null,
  };
}