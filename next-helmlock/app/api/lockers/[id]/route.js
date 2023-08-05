'use server';
import Locker from '@/models/Locker';
import { NextResponse } from 'next/server';
import db from '@/app/lib/db';

export async function GET(req, { params }) {
  await db.connect();
  const { id } = params;
  const data = await Locker.findOne({ _id: id });
  await db.disconnect();
  return NextResponse.json({ data }, { status: 500 });
}
