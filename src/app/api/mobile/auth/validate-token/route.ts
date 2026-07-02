import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json({
        success: false,
        valid: false,
      });
    }

    // Decode token (simple base64 token)
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [userId] = decoded.split(':');

    if (!userId) {
      return NextResponse.json({
        success: false,
        valid: false,
      });
    }

    // Check if user still exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        valid: false,
      });
    }

    // Return user data without password
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      valid: true,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Mobile validate token error:', error);
    return NextResponse.json({
      success: false,
      valid: false,
    });
  }
}
