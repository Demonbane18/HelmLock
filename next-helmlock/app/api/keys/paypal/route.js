import { getServerSession } from 'next-auth/react';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';

export async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    NextResponse.json({ message: 'You must be logged in.' }, { status: 401 });
    return;
  }

  return NextResponse.json({
    message: 'Success',
  });
}

export async function GET() {
  const data = process.env.PAYPAL_CLIENT_ID || 'sb';
  return NextResponse.json({ data }, { status: 200 });
}
