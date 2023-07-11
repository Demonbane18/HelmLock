import { getServerSession } from 'next-auth/react';
import Locker from '@/models/Locker';
import db from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req, res) {
  await db.connect();
  const lockers = await Locker.find({});
  await db.disconnect();
  return NextResponse.json({ lockers }, { status: 200 });
}
