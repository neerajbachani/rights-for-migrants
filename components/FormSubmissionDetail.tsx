'use client';

import { useState } from 'react';
import { FormSubmission, FormSubmissionStatus } from '@/lib/types/form';
import { formatDate } from '@/lib/utils';

interface FormSubmissionDetailProps {
  submission: FormSubmission | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (id: string, status: FormSubmissionStatus) => Promise<void>;
  onDelete: (id: string) => void;
  isUpdating?: boolean;
}

export default function FormSubmissionDetail({
  submission,
  isOpen,
  onClose,
  onStatusUpdate,
  onDelete,
  isUpdating = false
}: FormSubmissionDetailProps) {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !submission) return null;

  const isValidStatus = (status: string): status is FormSubmissionStatus => {
    return ['new', 'read', 'archived'].includes(status);
  };

  const handleStatusUpdate = async (newStatus: FormSubmissionStatus) => {
    if (newStatus === submission.status) return;
    
    try {
      setError(null);
      setIsUpdatingStatus(true);
      await onStatusUpdate(submission.id, newStatus);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleStatusChange = (value: string) => {
    if (isValidStatus(value)) {
      handleStatusUpdate(value);
    }
  };

  const handleDelete = () => {
    onDelete(submission.id);
  };

  const handleClose = () => {
    if (!isUpdatingStatus) {
      setError(null);
      onClose();
    }
  };

  const getStatusBadgeColor = (status: FormSubmissionStatus) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'read':
        return 'bg-green-100 text-green-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={handleClose}
        />

        {/* Dialog */}
        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Form Submission Details
                </h3>
                <p className="text-sm text-gray-500">
                  Submitted {formatDate(submission.submittedAt, true)}
                </p>
              </div>
            </div>
            
            <button
              onClick={handleClose}
              disabled={isUpdatingStatus}
              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#610035] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="mt-6">
            {/* Status and Actions */}
            <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700">Status:</span>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadgeColor(submission.status as FormSubmissionStatus)}`}>
                  {submission.status}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <select
                  value={submission.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={isUpdatingStatus}
                  className="text-sm border-gray-300 rounded-md focus:border-[#610035] focus:ring-[#610035] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="archived">Archived</option>
                </select>
                
                {isUpdatingStatus && (
                  <svg
                    className="animate-spin h-4 w-4 text-[#610035]"
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
                )}
              </div>
            </div>

            {/* Submission Details */}
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <div className="p-3 bg-gray-50 rounded-md border">
                    <p className="text-sm text-gray-900">{submission.name}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="p-3 bg-gray-50 rounded-md border">
                    {submission.email ? (
                      <a
                        href={`mailto:${submission.email}`}
                        className="text-sm text-[#610035] hover:text-[#4a0028] hover:underline"
                      >
                        {submission.email}
                      </a>
                    ) : (
                      <span className="text-sm text-gray-400 italic">Not provided</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="p-3 bg-gray-50 rounded-md border">
                    <a
                      href={`tel:${submission.phone}`}
                      className="text-sm text-[#610035] hover:text-[#4a0028] hover:underline"
                    >
                      {submission.phone}
                    </a>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nationality
                  </label>
                  <div className="p-3 bg-gray-50 rounded-md border">
                    <p className="text-sm text-gray-900">{submission.nationality}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <div className="p-3 bg-gray-50 rounded-md border">
                    <p className="text-sm text-gray-900">{submission.address}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Visa Status
                  </label>
                  <div className="p-3 bg-gray-50 rounded-md border">
                    <p className="text-sm text-gray-900">{submission.visaStatus}</p>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <div className="p-4 bg-gray-50 rounded-md border min-h-32">
                  {submission.message ? (
                    <p className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
                      {submission.message}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400 italic">No message provided</p>
                  )}
                </div>
              </div>

              {/* Consent */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Consent Given
                </label>
                <div className="p-3 bg-gray-50 rounded-md border">
                  <div className="flex items-center">
                    {submission.consent ? (
                      <>
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm text-gray-900">Yes, consent provided</span>
                      </>
                    ) : (
                      <>
                        <svg className="h-5 w-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="text-sm text-gray-900">No consent</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Submission ID
                  </label>
                  <div className="p-3 bg-gray-50 rounded-md border">
                    <p className="text-xs font-mono text-gray-600">{submission.id}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Updated
                  </label>
                  <div className="p-3 bg-gray-50 rounded-md border">
                    <p className="text-sm text-gray-900">
                      {formatDate(submission.updatedAt, true)}
                    </p>
                  </div>
                </div>
              </div>
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
                      Status Update Failed
                    </h3>
                    <div className="mt-1 text-sm text-red-700">
                      {error}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={handleDelete}
              disabled={isUpdatingStatus}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Delete Submission
            </button>
            
            <div className="flex items-center space-x-3">
              <a
                href={`mailto:${submission.email}?subject=Re: Your message from ${formatDate(submission.submittedAt)}&body=Hi ${submission.name},%0D%0A%0D%0AThank you for your message:%0D%0A%0D%0A"${submission.message}"%0D%0A%0D%0A`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#610035]"
              >
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
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Reply via Email
              </a>
              
              <button
                onClick={handleClose}
                disabled={isUpdatingStatus}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#610035] hover:bg-[#4a0028] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#610035] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}