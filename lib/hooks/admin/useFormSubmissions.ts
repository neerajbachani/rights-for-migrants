"use client";

import { useQuery } from '@tanstack/react-query';
import { FormSubmission, GetSubmissionsResponse, PaginationInfo } from '@/lib/types/form';

interface UseFormSubmissionsParams {
  page?: number;
  limit?: number;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

interface UseFormSubmissionsReturn {
  submissions: FormSubmission[];
  isLoading: boolean;
  error: string | null;
  pagination: PaginationInfo;
  refetch: () => void;
}

export function useFormSubmissions(params: UseFormSubmissionsParams = {}): UseFormSubmissionsReturn {
  const { page = 1, limit = 10, status, dateFrom, dateTo } = params;

  const query = useQuery({
    queryKey: ['formSubmissions', { page, limit, status, dateFrom, dateTo }],
    queryFn: async (): Promise<GetSubmissionsResponse> => {
      const searchParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (status) searchParams.append('status', status);
      if (dateFrom) searchParams.append('dateFrom', dateFrom);
      if (dateTo) searchParams.append('dateTo', dateTo);

      const response = await fetch(`/api/admin/forms?${searchParams.toString()}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    submissions: query.data?.submissions || [],
    isLoading: query.isLoading,
    error: query.error?.message || null,
    pagination: query.data?.pagination || {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
    refetch: query.refetch,
  };
}