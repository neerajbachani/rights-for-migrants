import { prisma } from './prisma';
import { FormSubmission, SubmitFormRequest, FormSubmissionStatus } from '../types/form';

/**
 * Database operations for form submissions
 */
export class FormDatabase {
  /**
   * Create a new form submission
   */
  static async createSubmission(data: SubmitFormRequest): Promise<FormSubmission> {
    return await prisma.formSubmission.create({
      data: {
        name: data.name,
        email: data.email || null,
        phone: data.phone,
        address: data.address,
        nationality: data.nationality,
        visaStatus: data.visaStatus,
        message: data.message || null,
        consent: data.consent,
      },
    });
  }

  /**
   * Get all form submissions with pagination
   */
  static async getSubmissions(
    page: number = 1,
    limit: number = 10,
    status?: string
  ): Promise<{ submissions: FormSubmission[]; total: number }> {
    const skip = (page - 1) * limit;
    
    const where = status ? { status } : {};
    
    const [submissions, total] = await Promise.all([
      prisma.formSubmission.findMany({
        where,
        skip,
        take: limit,
        orderBy: { submittedAt: 'desc' },
      }),
      prisma.formSubmission.count({ where }),
    ]);

    return { submissions, total };
  }

  /**
   * Update submission status
   */
  static async updateSubmissionStatus(
    id: string,
    status: FormSubmissionStatus
  ): Promise<FormSubmission> {
    return await prisma.formSubmission.update({
      where: { id },
      data: { status },
    });
  }

  /**
   * Delete a submission
   */
  static async deleteSubmission(id: string): Promise<FormSubmission> {
    return await prisma.formSubmission.delete({
      where: { id },
    });
  }

  /**
   * Bulk delete submissions
   */
  static async bulkDeleteSubmissions(ids: string[]): Promise<{ count: number }> {
    return await prisma.formSubmission.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  /**
   * Bulk update submission status
   */
  static async bulkUpdateStatus(
    ids: string[],
    status: FormSubmissionStatus
  ): Promise<{ count: number }> {
    return await prisma.formSubmission.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: { status },
    });
  }

  /**
   * Get submissions for export with optional filtering
   */
  static async getSubmissionsForExport(filters?: {
    status?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }): Promise<FormSubmission[]> {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.dateFrom || filters?.dateTo) {
      where.submittedAt = {};
      if (filters.dateFrom) {
        where.submittedAt.gte = filters.dateFrom;
      }
      if (filters.dateTo) {
        where.submittedAt.lte = filters.dateTo;
      }
    }

    return await prisma.formSubmission.findMany({
      where,
      orderBy: { submittedAt: 'desc' },
    });
  }
}