"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormSubmission, UpdateStatusRequest, FormSubmissionStatus } from '@/lib/types/form';

interface UseUpdateSubmissionStatusReturn {
  updateStatus: (id: string, status: FormSubmissionStatus) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function useUpdateSubmissionStatus(): UseUpdateSubmissionStatusReturn {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: FormSubmissionStatus }): Promise<FormSubmission> => {
      const requestBody: UpdateStatusRequest = { status };

      const response = await fetch(`/api/admin/forms/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return response.json();
    },
    onMutate: async ({ id, status }) => {
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
            submissions: old.submissions.map((submission: FormSubmission) =>
              submission.id === id ? { ...submission, status } : submission
            ),
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
    updateStatus: async (id: string, status: FormSubmissionStatus) => {
      await mutation.mutateAsync({ id, status });
    },
    isLoading: mutation.isPending,
    error: mutation.error?.message || null,
  };
}