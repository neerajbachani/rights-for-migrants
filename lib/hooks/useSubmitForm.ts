"use client";

import { useMutation } from '@tanstack/react-query';
import { SubmitFormRequest, SubmitFormResponse } from '@/lib/types/form';

interface UseSubmitFormReturn {
    submitForm: (data: SubmitFormRequest) => Promise<SubmitFormResponse>;
    isLoading: boolean;
    error: string | null;
    isSuccess: boolean;
    reset: () => void;
}

export function useSubmitForm(): UseSubmitFormReturn {
    const mutation = useMutation({
        mutationFn: async (data: SubmitFormRequest): Promise<SubmitFormResponse> => {
            const response = await fetch('/api/forms/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            return response.json();
        },
    });

    return {
        submitForm: mutation.mutateAsync,
        isLoading: mutation.isPending,
        error: mutation.error?.message || null,
        isSuccess: mutation.isSuccess,
        reset: mutation.reset,
    };
}