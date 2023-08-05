const cloudinary = require('cloudinary').v2;
import { NextResponse } from 'next/server';
export async function GET() {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp: timestamp,
    },
    process.env.CLOUDINARY_SECRET
  );

  return NextResponse.json({ signature, timestamp }, { status: 200 });
}
