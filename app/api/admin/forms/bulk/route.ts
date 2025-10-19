import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import { prisma } from '@/lib/utils/prisma';
import { z } from 'zod';

// Validation schema for bulk operations
const bulkOperationSchema = z.object({
    action: z.enum(['delete', 'updateStatus']),
    submissionIds: z.array(z.string()).min(1, 'At least one submission ID is required'),
    status: z.enum(['new', 'read', 'archived']).optional(),
}).refine((data) => {
    // If action is updateStatus, status must be provided
    if (data.action === 'updateStatus' && !data.status) {
        return false;
    }
    return true;
}, {
    message: 'Status is required when action is updateStatus',
    path: ['status'],
});

export async function POST(request: NextRequest) {
    try {
        // Verify JWT authentication - get token from cookie
        const token = request.cookies.get('auth-token')?.value;
        
        if (!token) {
            return NextResponse.json(
                { success: false, error: 'Authentication required' },
                { status: 401 }
            );
        }

        const decoded = await verifyToken(token);
        if (!decoded) {
            return NextResponse.json(
                { success: false, error: 'Invalid or expired token' },
                { status: 401 }
            );
        }

        // Validate request body
        const body = await request.json();
        const validationResult = bulkOperationSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid request body',
                    details: validationResult.error.errors
                },
                { status: 400 }
            );
        }

        const { action, submissionIds, status } = validationResult.data;

        // Verify all submissions exist
        const existingSubmissions = await prisma.formSubmission.findMany({
            where: {
                id: {
                    in: submissionIds,
                },
            },
            select: { id: true },
        });

        const existingIds = existingSubmissions.map(sub => sub.id);
        const missingIds = submissionIds.filter(id => !existingIds.includes(id));

        if (missingIds.length > 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Some submissions not found',
                    missingIds
                },
                { status: 404 }
            );
        }

        let result;
        let affectedCount = 0;

        if (action === 'delete') {
            // Perform bulk delete
            result = await prisma.formSubmission.deleteMany({
                where: {
                    id: {
                        in: submissionIds,
                    },
                },
            });
            affectedCount = result.count;

            return NextResponse.json({
                success: true,
                message: `Successfully deleted ${affectedCount} submissions`,
                deletedCount: affectedCount,
            });

        } else if (action === 'updateStatus') {
            // Perform bulk status update
            result = await prisma.formSubmission.updateMany({
                where: {
                    id: {
                        in: submissionIds,
                    },
                },
                data: {
                    status: status!,
                    updatedAt: new Date(),
                },
            });
            affectedCount = result.count;

            return NextResponse.json({
                success: true,
                message: `Successfully updated ${affectedCount} submissions to ${status}`,
                updatedCount: affectedCount,
                newStatus: status,
            });
        }

    } catch (error) {
        console.error('Error performing bulk operation:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}