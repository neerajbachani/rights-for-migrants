import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import { prisma } from '@/lib/utils/prisma';
import { z } from 'zod';

// Validation schema for status update
const updateStatusSchema = z.object({
    status: z.enum(['new', 'read', 'archived']),
});

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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

        // Validate request body
        const body = await request.json();
        const validationResult = updateStatusSchema.safeParse(body);

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

        const { status } = validationResult.data;
        const { id } = await params;

        // Check if submission exists
        const existingSubmission = await prisma.formSubmission.findUnique({
            where: { id },
        });

        if (!existingSubmission) {
            return NextResponse.json(
                { success: false, error: 'Form submission not found' },
                { status: 404 }
            );
        }

        // Update submission status
        const updatedSubmission = await prisma.formSubmission.update({
            where: { id },
            data: {
                status,
                updatedAt: new Date(),
            },
        });

        return NextResponse.json({
            success: true,
            submission: updatedSubmission,
        });

    } catch (error) {
        console.error('Error updating form submission status:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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

        const { id } = await params;

        // Check if submission exists
        const existingSubmission = await prisma.formSubmission.findUnique({
            where: { id },
        });

        if (!existingSubmission) {
            return NextResponse.json(
                { success: false, error: 'Form submission not found' },
                { status: 404 }
            );
        }

        // Delete submission
        await prisma.formSubmission.delete({
            where: { id },
        });

        return NextResponse.json({
            success: true,
            message: 'Form submission deleted successfully',
        });

    } catch (error) {
        console.error('Error deleting form submission:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}