'use server';
import Locker from '@/models/Locker';
import { NextRequest, NextResponse } from 'next/server';
import db from '@/app/lib/db';
import connectMongoDB from '@/app/lib/mongoose';
export async function GET(req, { params }) {
  await connectMongoDB();
  const { id } = params;
  const data = await Locker.findOne({ _id: id });
  return NextResponse.json({ data }, { status: 500 });
  // return locker;
}
