import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import { FormDatabase } from '@/lib/utils/formDatabase';
import { z } from 'zod';
import * as XLSX from 'xlsx';

// Validation schema for export query parameters
const exportFormsSchema = z.object({
  status: z.enum(['new', 'read', 'archived']).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    // Verify JWT authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Parse and validate query parameters
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    
    const validationResult = exportFormsSchema.safeParse(queryParams);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid query parameters',
          details: validationResult.error.errors
        },
        { status: 400 }
      );
    }

    const { status, dateFrom, dateTo } = validationResult.data;

    // Build filters for export
    const filters: {
      status?: string;
      dateFrom?: Date;
      dateTo?: Date;
    } = {};

    if (status) {
      filters.status = status;
    }
    
    if (dateFrom) {
      filters.dateFrom = new Date(dateFrom);
    }
    
    if (dateTo) {
      filters.dateTo = new Date(dateTo);
    }

    // Get submissions for export
    const submissions = await FormDatabase.getSubmissionsForExport(filters);

    // Prepare data for Excel export
    const excelData = submissions.map(submission => ({
      'Date': submission.submittedAt.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
      'Name': submission.name,
      'Email': submission.email,
      'Message': submission.message,
      'Status': submission.status.charAt(0).toUpperCase() + submission.status.slice(1)
    }));

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Set column widths for better formatting
    const columnWidths = [
      { wch: 20 }, // Date
      { wch: 25 }, // Name
      { wch: 30 }, // Email
      { wch: 50 }, // Message
      { wch: 12 }, // Status
    ];
    worksheet['!cols'] = columnWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Form Submissions');

    // Generate Excel buffer
    const excelBuffer = XLSX.write(workbook, { 
      type: 'buffer', 
      bookType: 'xlsx' 
    });

    // Generate filename with current date
    const currentDate = new Date().toISOString().split('T')[0];
    const filename = `form-submissions-${currentDate}.xlsx`;

    // Return Excel file with appropriate headers
    return new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': excelBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('Error exporting form submissions:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}