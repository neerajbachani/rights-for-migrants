'use client';

import { ReactNode, useState } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import DashboardNavigation from './DashboardNavigation';
import LoadingSpinner from './LoadingSpinner';

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  isLoading?: boolean;
  error?: string | null;
  actions?: ReactNode;
  currentSection?: string;
  onSectionChange?: (section: string) => void;
  newSubmissionsCount?: number;
}

export default function DashboardLayout({
  children,
  title = 'Admin Dashboard',
  subtitle,
  isLoading = false,
  error = null,
  actions,
  currentSection: externalCurrentSection,
  onSectionChange: externalOnSectionChange,
  newSubmissionsCount = 0
}: DashboardLayoutProps) {
  const [internalCurrentSection, setInternalCurrentSection] = useState('images');
  
  const currentSection = externalCurrentSection ?? internalCurrentSection;
  const onSectionChange = externalOnSectionChange ?? setInternalCurrentSection;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardNavigation 
          currentSection={currentSection}
          onSectionChange={onSectionChange}
          newSubmissionsCount={newSubmissionsCount}
        />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
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
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Error Loading Dashboard
                  </h3>
                  <p className="mt-1 text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <DashboardNavigation 
          currentSection={currentSection}
          onSectionChange={onSectionChange}
          newSubmissionsCount={newSubmissionsCount}
        />
        
        {/* Page Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {title}
                  </h1>
                  {subtitle && (
                    <p className="mt-1 text-sm text-gray-600">
                      {subtitle}
                    </p>
                  )}
                </div>
                {actions && (
                  <div className="flex items-center space-x-3">
                    {actions}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {isLoading ? (
              <div className="flex items-center justify-center min-h-96">
                <LoadingSpinner size="lg" text="Loading dashboard..." />
              </div>
            ) : (
              <ErrorBoundary
                fallback={
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-yellow-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">
                          Content Error
                        </h3>
                        <p className="mt-1 text-sm text-yellow-700">
                          There was an error loading this section. Please try refreshing the page.
                        </p>
                      </div>
                    </div>
                  </div>
                }
              >
                {children}
              </ErrorBoundary>
            )}
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}