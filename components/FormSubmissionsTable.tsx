"use client";

import { useState } from "react";
import { FormSubmission, FormSubmissionStatus } from "@/lib/types/form";
import { useFormSubmissions } from "@/lib/hooks/admin/useFormSubmissions";
import { useUpdateSubmissionStatus } from "@/lib/hooks/admin/useUpdateSubmissionStatus";
import { useDeleteSubmission } from "@/lib/hooks/admin/useDeleteSubmission";
import { useBulkOperations } from "@/lib/hooks/admin/useBulkOperations";
import { useExportSubmissions } from "@/lib/hooks/admin/useExportSubmissions";
import { formatDate } from "@/lib/utils";
import LoadingSpinner from "./LoadingSpinner";
import FormSubmissionDetail from "./FormSubmissionDetail";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import BulkOperationsBar from "@/components/BulkOperationsBar";

interface FormSubmissionsTableProps {
  onExport?: () => void;
}

export default function FormSubmissionsTable({
  onExport,
}: FormSubmissionsTableProps) {
  // State for pagination and filtering
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateFromFilter, setDateFromFilter] = useState<string>("");
  const [dateToFilter, setDateToFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<
    "submittedAt" | "name" | "email" | "status"
  >("submittedAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // State for selection and modals
  const [selectedSubmissions, setSelectedSubmissions] = useState<Set<string>>(
    new Set()
  );
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [detailSubmission, setDetailSubmission] =
    useState<FormSubmission | null>(null);
  const [deleteSubmission, setDeleteSubmission] =
    useState<FormSubmission | null>(null);

  // Hooks
  const { submissions, isLoading, error, pagination, refetch } =
    useFormSubmissions({
      page: currentPage,
      limit: pageSize,
      status: statusFilter || undefined,
      dateFrom: dateFromFilter || undefined,
      dateTo: dateToFilter || undefined,
    });

  const { updateStatus, isLoading: isUpdating } = useUpdateSubmissionStatus();
  const { deleteSubmission: performDelete, isLoading: isDeleting } =
    useDeleteSubmission();
  const {
    bulkDelete,
    bulkUpdateStatus,
    isLoading: isBulkLoading,
  } = useBulkOperations();
  const { exportSubmissions, isLoading: isExporting } = useExportSubmissions();

  // Sort submissions client-side
  const sortedSubmissions = [...submissions].sort((a, b) => {
    let aValue: any = a[sortBy];
    let bValue: any = b[sortBy];

    if (sortBy === "submittedAt") {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    } else if (typeof aValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortOrder === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  // Handle sorting
  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  // Handle selection
  const handleSubmissionSelect = (submissionId: string, selected: boolean) => {
    const newSelection = new Set(selectedSubmissions);
    if (selected) {
      newSelection.add(submissionId);
    } else {
      newSelection.delete(submissionId);
    }
    setSelectedSubmissions(newSelection);
  };

  const handleSelectAll = () => {
    if (selectedSubmissions.size === sortedSubmissions.length) {
      setSelectedSubmissions(new Set());
    } else {
      setSelectedSubmissions(new Set(sortedSubmissions.map((s) => s.id)));
    }
  };

  // Handle actions
  const isValidStatus = (status: string): status is FormSubmissionStatus => {
    return ["new", "read", "archived"].includes(status);
  };

  const handleStatusUpdate = async (
    id: string,
    status: FormSubmissionStatus
  ) => {
    try {
      await updateStatus(id, status);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleStatusChange = (id: string, value: string) => {
    if (isValidStatus(value)) {
      handleStatusUpdate(id, value);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await performDelete(id);
      setDeleteSubmission(null);
    } catch (error) {
      console.error("Failed to delete submission:", error);
    }
  };

  const handleBulkDelete = async (submissionIds: string[]) => {
    try {
      await bulkDelete(submissionIds);
      setSelectedSubmissions(new Set());
      setIsSelectionMode(false);
    } catch (error) {
      console.error("Failed to bulk delete:", error);
    }
  };

  const handleBulkStatusUpdate = async (
    submissionIds: string[],
    status: FormSubmissionStatus
  ) => {
    try {
      await bulkUpdateStatus(submissionIds, status);
      setSelectedSubmissions(new Set());
      setIsSelectionMode(false);
    } catch (error) {
      console.error("Failed to bulk update status:", error);
    }
  };

  const handleBulkExport = async (submissionIds: string[]) => {
    try {
      await exportSubmissions({ ids: submissionIds });
    } catch (error) {
      console.error("Failed to export selected submissions:", error);
    }
  };

  // Handle filters
  const handleFilterChange = () => {
    setCurrentPage(1);
    refetch();
  };

  const clearFilters = () => {
    setStatusFilter("");
    setDateFromFilter("");
    setDateToFilter("");
    setCurrentPage(1);
  };

  // Selection mode handlers
  const enterSelectionMode = () => {
    setIsSelectionMode(true);
  };

  const exitSelectionMode = () => {
    setIsSelectionMode(false);
    setSelectedSubmissions(new Set());
  };

  // Get status badge color
  const getStatusBadgeColor = (status: FormSubmissionStatus) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "read":
        return "bg-green-100 text-green-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Loading state
  if (isLoading && submissions.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-gray-600">Loading form submissions...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
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
          <h3 className="ml-3 text-sm font-medium text-red-800">
            Error loading form submissions
          </h3>
        </div>
        <div className="mt-2 text-sm text-red-700">{error}</div>
        <div className="mt-4">
          <button
            onClick={() => refetch()}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900">
            Form Submissions
          </h2>
          <p className="text-sm text-gray-500">
            {isSelectionMode && selectedSubmissions.size > 0
              ? `${selectedSubmissions.size} of ${sortedSubmissions.length} selected`
              : `${pagination.total} ${
                  pagination.total === 1 ? "submission" : "submissions"
                } total`}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {isSelectionMode ? (
            <>
              <button
                onClick={handleSelectAll}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#610035]"
              >
                {selectedSubmissions.size === sortedSubmissions.length
                  ? "Deselect All"
                  : "Select All"}
              </button>

              <button
                onClick={exitSelectionMode}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#610035]"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              {sortedSubmissions.length > 0 && (
                <button
                  onClick={enterSelectionMode}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#610035]"
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Select
                </button>
              )}

              {onExport && (
                <button
                  onClick={onExport}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#610035] hover:bg-[#4a0028] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#610035]"
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
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Export
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label
              htmlFor="status-filter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Status
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#610035] focus:ring-[#610035] sm:text-sm"
            >
              <option value="">All Statuses</option>
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="date-from"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              From Date
            </label>
            <input
              type="date"
              id="date-from"
              value={dateFromFilter}
              onChange={(e) => setDateFromFilter(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#610035] focus:ring-[#610035] sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="date-to"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              To Date
            </label>
            <input
              type="date"
              id="date-to"
              value={dateToFilter}
              onChange={(e) => setDateToFilter(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#610035] focus:ring-[#610035] sm:text-sm"
            />
          </div>

          <div className="flex items-end space-x-2">
            <button
              onClick={handleFilterChange}
              className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#610035] hover:bg-[#4a0028] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#610035]"
            >
              Apply
            </button>
            <button
              onClick={clearFilters}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#610035]"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Operations Bar */}
      {isSelectionMode && selectedSubmissions.size > 0 && (
        <BulkOperationsBar
          selectedCount={selectedSubmissions.size}
          onBulkDelete={() => handleBulkDelete(Array.from(selectedSubmissions))}
          onBulkStatusUpdate={(status: FormSubmissionStatus) =>
            handleBulkStatusUpdate(Array.from(selectedSubmissions), status)
          }
          onBulkExport={() => handleBulkExport(Array.from(selectedSubmissions))}
          isLoading={isBulkLoading || isExporting}
        />
      )}

      {/* Empty state */}
      {sortedSubmissions.length === 0 && !isLoading ? (
        <div className="text-center py-12">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100">
            <svg
              className="h-8 w-8 text-gray-400"
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
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No form submissions found
          </h3>
          <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
            {statusFilter || dateFromFilter || dateToFilter
              ? "No submissions match your current filters. Try adjusting your search criteria."
              : "Form submissions will appear here once users start submitting the contact form."}
          </p>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {isSelectionMode && (
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={
                            selectedSubmissions.size ===
                              sortedSubmissions.length &&
                            sortedSubmissions.length > 0
                          }
                          onChange={handleSelectAll}
                          className="h-4 w-4 text-[#610035] focus:ring-[#610035] border-gray-300 rounded"
                        />
                      </th>
                    )}
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("submittedAt")}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Date</span>
                        {sortBy === "submittedAt" && (
                          <svg
                            className={`h-4 w-4 ${
                              sortOrder === "asc" ? "transform rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Name</span>
                        {sortBy === "name" && (
                          <svg
                            className={`h-4 w-4 ${
                              sortOrder === "asc" ? "transform rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("email")}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Email</span>
                        {sortBy === "email" && (
                          <svg
                            className={`h-4 w-4 ${
                              sortOrder === "asc" ? "transform rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nationality
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Visa Status
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Status</span>
                        {sortBy === "status" && (
                          <svg
                            className={`h-4 w-4 ${
                              sortOrder === "asc" ? "transform rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedSubmissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-gray-50">
                      {isSelectionMode && (
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedSubmissions.has(submission.id)}
                            onChange={(e) =>
                              handleSubmissionSelect(
                                submission.id,
                                e.target.checked
                              )
                            }
                            className="h-4 w-4 text-[#610035] focus:ring-[#610035] border-gray-300 rounded"
                          />
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(submission.submittedAt, true)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {submission.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {submission.email || (
                          <span className="text-gray-400 italic">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {submission.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {submission.nationality}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {submission.visaStatus}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(
                            submission.status as FormSubmissionStatus
                          )}`}
                        >
                          {submission.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setDetailSubmission(submission)}
                            className="text-[#610035] hover:text-[#4a0028] font-medium"
                          >
                            View
                          </button>
                          <select
                            value={submission.status}
                            onChange={(e) =>
                              handleStatusChange(submission.id, e.target.value)
                            }
                            disabled={isUpdating}
                            className="text-xs border-gray-300 rounded focus:border-[#610035] focus:ring-[#610035]"
                          >
                            <option value="new">New</option>
                            <option value="read">Read</option>
                            <option value="archived">Archived</option>
                          </select>
                          <button
                            onClick={() => setDeleteSubmission(submission)}
                            disabled={isDeleting}
                            className="text-red-600 hover:text-red-900 font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4 rounded-lg">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentPage(
                      Math.min(pagination.totalPages, currentPage + 1)
                    )
                  }
                  disabled={currentPage === pagination.totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">
                      {(currentPage - 1) * pageSize + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(currentPage * pageSize, pagination.total)}
                    </span>{" "}
                    of <span className="font-medium">{pagination.total}</span>{" "}
                    results
                  </p>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="text-sm border-gray-300 rounded focus:border-[#610035] focus:ring-[#610035]"
                  >
                    <option value={10}>10 per page</option>
                    <option value={25}>25 per page</option>
                    <option value={50}>50 per page</option>
                  </select>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Previous</span>
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>

                    {/* Page numbers */}
                    {Array.from(
                      { length: Math.min(5, pagination.totalPages) },
                      (_, i) => {
                        const pageNum =
                          Math.max(
                            1,
                            Math.min(pagination.totalPages - 4, currentPage - 2)
                          ) + i;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === pageNum
                                ? "z-10 bg-[#610035] border-[#610035] text-white"
                                : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                    )}

                    <button
                      onClick={() =>
                        setCurrentPage(
                          Math.min(pagination.totalPages, currentPage + 1)
                        )
                      }
                      disabled={currentPage === pagination.totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Next</span>
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      {detailSubmission && (
        <FormSubmissionDetail
          submission={detailSubmission}
          isOpen={!!detailSubmission}
          onClose={() => setDetailSubmission(null)}
          onStatusUpdate={handleStatusUpdate}
          onDelete={(id: string) => {
            setDetailSubmission(null);
            const submission = submissions.find((s) => s.id === id);
            if (submission) setDeleteSubmission(submission);
          }}
        />
      )}

      {deleteSubmission && (
        <DeleteConfirmationDialog
          image={null}
          isOpen={!!deleteSubmission}
          onClose={() => setDeleteSubmission(null)}
          onConfirm={() => handleDelete(deleteSubmission.id)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
