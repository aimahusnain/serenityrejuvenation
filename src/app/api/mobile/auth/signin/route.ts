import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Signin schema for mobile API
const signinSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedFields = signinSchema.safeParse(body);
    if (!validatedFields.success) {
      return NextResponse.json(
        {
          success: false,
          error: validatedFields.error.issues[0].message,
        },
        { status: 400 }
      );
    }

    const { email, password } = validatedFields.data;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        {
          success: false,
          error: 'No account found with this email',
        },
        { status: 401 }
      );
    }

    // Verify password
    const bcrypt = await import('bcryptjs');
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email or password',
        },
        { status: 401 }
      );
    }

    // Create a simple token (you can use JWT here if needed)
    const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      token,
      message: 'Signed in successfully',
    });
  } catch (error) {
    console.error('Mobile signin error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to sign in. Please try again.',
      },
      { status: 500 }
    );
  }
}
