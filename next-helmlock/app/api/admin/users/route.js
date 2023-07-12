import User from '@/models/User';
import db from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req, res) {
  await db.connect();
  const users = await User.find({});
  await db.disconnect();
  return NextResponse.json({ users }, { status: 200 });
}
