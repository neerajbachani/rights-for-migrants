import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/utils/prisma';
import { SubmitFormRequest, SubmitFormResponse, ErrorResponse } from '@/lib/types/form';
import { validateFormSubmission, sanitizeFormInput } from '@/lib/utils/formValidation';
import { checkFormRateLimit, recordFormSubmission, getClientIP } from '@/lib/utils/formRateLimit';

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);
    
    // Check rate limiting
    const rateLimitResult = checkFormRateLimit(clientIP);
    if (!rateLimitResult.allowed) {
      const errorResponse: ErrorResponse = {
        success: false,
        error: rateLimitResult.blockedUntil 
          ? `Too many form submissions. Please try again after ${rateLimitResult.blockedUntil.toLocaleTimeString()}.`
          : 'Rate limit exceeded. Please try again later.',
        code: 'RATE_LIMIT_EXCEEDED'
      };
      
      return NextResponse.json(errorResponse, { status: 429 });
    }

    // Parse request body
    let body: any;
    try {
      body = await request.json();
    } catch (error) {
      const errorResponse: ErrorResponse = {
        success: false,
        error: 'Invalid JSON format',
        code: 'INVALID_JSON'
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Validate input
    const validationResult = validateFormSubmission(body);
    if (!validationResult.isValid) {
      const errorResponse: ErrorResponse = {
        success: false,
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: validationResult.errors
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Sanitize input
    const sanitizedData = sanitizeFormInput(body as SubmitFormRequest);

    // Record the submission attempt for rate limiting
    recordFormSubmission(clientIP);

    // Save to database
    try {
      const formSubmission = await prisma.formSubmission.create({
        data: {
          name: sanitizedData.name,
          email: sanitizedData.email,
          message: sanitizedData.message,
          status: 'new',
          submittedAt: new Date(),
        }
      });

      console.log('Form submission created:', {
        id: formSubmission.id,
        email: formSubmission.email,
        submittedAt: formSubmission.submittedAt
      });

      const successResponse: SubmitFormResponse = {
        success: true,
        message: 'Thank you for your submission! We will get back to you soon.'
      };

      return NextResponse.json(successResponse, { status: 201 });

    } catch (dbError) {
      console.error('Database error during form submission:', dbError);
      
      const errorResponse: ErrorResponse = {
        success: false,
        error: 'Failed to save form submission. Please try again.',
        code: 'DATABASE_ERROR'
      };
      
      return NextResponse.json(errorResponse, { status: 500 });
    }

  } catch (error) {
    console.error('Form submission API error:', error);
    
    const errorResponse: ErrorResponse = {
      success: false,
      error: 'Internal server error. Please try again later.',
      code: 'INTERNAL_ERROR'
    };
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// Handle unsupported methods
export async function GET() {
  const errorResponse: ErrorResponse = {
    success: false,
    error: 'Method not allowed',
    code: 'METHOD_NOT_ALLOWED'
  };
  
  return NextResponse.json(errorResponse, { status: 405 });
}

export async function PUT() {
  const errorResponse: ErrorResponse = {
    success: false,
    error: 'Method not allowed',
    code: 'METHOD_NOT_ALLOWED'
  };
  
  return NextResponse.json(errorResponse, { status: 405 });
}

export async function DELETE() {
  const errorResponse: ErrorResponse = {
    success: false,
    error: 'Method not allowed',
    code: 'METHOD_NOT_ALLOWED'
  };
  
  return NextResponse.json(errorResponse, { status: 405 });
}