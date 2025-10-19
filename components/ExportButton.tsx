'use client';

import { useState } from 'react';
import { useExportSubmissions } from '@/lib/hooks/admin/useExportSubmissions';
import { ExportFilters } from '@/lib/types/form';

interface ExportButtonProps {
  currentFilters?: ExportFilters;
  className?: string;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export default function ExportButton({ 
  currentFilters = {}, 
  className = '',
  variant = 'primary',
  size = 'md'
}: ExportButtonProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [exportFilters, setExportFilters] = useState<ExportFilters>(currentFilters);
  const [error, setError] = useState<string | null>(null);

  const { exportSubmissions, isLoading } = useExportSubmissions();

  const handleExport = async (filters: ExportFilters = {}) => {
    try {
      setError(null);
      await exportSubmissions(filters);
      setShowFilters(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
    }
  };

  const handleQuickExport = () => {
    handleExport(currentFilters);
  };

  const handleFilteredExport = () => {
    handleExport(exportFilters);
  };

  const resetFilters = () => {
    setExportFilters({});
  };

  const getButtonClasses = () => {
    const baseClasses = 'inline-flex items-center border font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base'
    };

    const variantClasses = {
      primary: 'border-transparent text-white bg-[#610035] hover:bg-[#4a0028] focus:ring-[#610035]',
      secondary: 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-[#610035]'
    };

    return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;
  };

  if (showFilters) {
    return (
      <div className="relative">
        {/* Export Filters Modal */}
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowFilters(false)}
            />

            {/* Dialog */}
            <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Export Form Submissions
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Choose filters to customize your export
                  </p>
                </div>
                <button
                  onClick={() => setShowFilters(false)}
                  className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#610035] focus:ring-offset-2"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Filters */}
              <div className="mt-6 space-y-4">
                <div>
                  <label htmlFor="export-status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status Filter
                  </label>
                  <select
                    id="export-status"
                    value={exportFilters.status || ''}
                    onChange={(e) => setExportFilters({ ...exportFilters, status: e.target.value || undefined })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#610035] focus:ring-[#610035] sm:text-sm"
                  >
                    <option value="">All Statuses</option>
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="export-date-from" className="block text-sm font-medium text-gray-700 mb-1">
                      From Date
                    </label>
                    <input
                      type="date"
                      id="export-date-from"
                      value={exportFilters.dateFrom || ''}
                      onChange={(e) => setExportFilters({ ...exportFilters, dateFrom: e.target.value || undefined })}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#610035] focus:ring-[#610035] sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="export-date-to" className="block text-sm font-medium text-gray-700 mb-1">
                      To Date
                    </label>
                    <input
                      type="date"
                      id="export-date-to"
                      value={exportFilters.dateTo || ''}
                      onChange={(e) => setExportFilters({ ...exportFilters, dateTo: e.target.value || undefined })}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#610035] focus:ring-[#610035] sm:text-sm"
                    />
                  </div>
                </div>

                {/* Current Filters Summary */}
                {(exportFilters.status || exportFilters.dateFrom || exportFilters.dateTo) && (
                  <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">Export will include:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      {exportFilters.status && (
                        <li>• Status: {exportFilters.status}</li>
                      )}
                      {exportFilters.dateFrom && (
                        <li>• From: {new Date(exportFilters.dateFrom).toLocaleDateString()}</li>
                      )}
                      {exportFilters.dateTo && (
                        <li>• To: {new Date(exportFilters.dateTo).toLocaleDateString()}</li>
                      )}
                      {!exportFilters.status && !exportFilters.dateFrom && !exportFilters.dateTo && (
                        <li>• All submissions</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-3">
                  <div className="flex">
                    <svg
                      className="h-5 w-5 text-red-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Export Failed
                      </h3>
                      <div className="mt-1 text-sm text-red-700">
                        {error}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="mt-6 flex items-center justify-between">
                <button
                  onClick={resetFilters}
                  className="text-sm text-gray-500 hover:text-gray-700 font-medium"
                >
                  Clear Filters
                </button>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowFilters(false)}
                    disabled={isLoading}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#610035] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  
                  <button
                    onClick={handleFilteredExport}
                    disabled={isLoading}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#610035] hover:bg-[#4a0028] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#610035] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Exporting...
                      </>
                    ) : (
                      <>
                        <svg
                          className="mr-2 h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        Export Excel
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Main Export Button */}
      <div className="flex items-center">
        <button
          onClick={handleQuickExport}
          disabled={isLoading}
          className={getButtonClasses()}
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Exporting...
            </>
          ) : (
            <>
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Export
            </>
          )}
        </button>

        {/* Dropdown Arrow */}
        <button
          onClick={() => setShowFilters(true)}
          disabled={isLoading}
          className={`ml-1 ${getButtonClasses()} !px-2 !border-l-0 !rounded-l-none`}
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Error Toast */}
      {error && !showFilters && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-red-50 border border-red-200 rounded-md p-3 shadow-lg z-10">
          <div className="flex">
            <svg
              className="h-5 w-5 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-red-800">
                Export Failed
              </h3>
              <div className="mt-1 text-sm text-red-700">
                {error}
              </div>
              <div className="mt-2">
                <button
                  onClick={() => setError(null)}
                  className="text-sm text-red-600 hover:text-red-500 font-medium"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}