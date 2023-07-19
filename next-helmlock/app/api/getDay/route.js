import { NextResponse } from 'next/server';
import db from '@/app/lib/db';
import Day from '@/models/Day';
import ClosedDay from '@/models/ClosedDay';

export async function GET(req, res) {
  await db.connect();
  const dayOfWeek = new Date().getDay();
  const openDay = await Day.findOne({ dayOfWeek: dayOfWeek });
  await db.disconnect();
  return NextResponse.json({ openDay }, { status: 200 });
}
