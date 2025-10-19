"use client";

import { useMutation } from '@tanstack/react-query';

import { ExportFilters } from '@/lib/types/form';

interface UseExportSubmissionsReturn {
  exportSubmissions: (filters?: ExportFilters) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function useExportSubmissions(): UseExportSubmissionsReturn {
  const mutation = useMutation({
    mutationFn: async (filters: ExportFilters = {}): Promise<void> => {
      const searchParams = new URLSearchParams();

      if (filters.status) searchParams.append('status', filters.status);
      if (filters.dateFrom) searchParams.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) searchParams.append('dateTo', filters.dateTo);

      const response = await fetch(`/api/admin/forms/export?${searchParams.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      // Handle file download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Get filename from Content-Disposition header or use default
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'form-submissions.xlsx';
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
  });

  return {
    exportSubmissions: async (filters: ExportFilters = {}) => {
      await mutation.mutateAsync(filters);
    },
    isLoading: mutation.isPending,
    error: mutation.error?.message || null,
  };
}