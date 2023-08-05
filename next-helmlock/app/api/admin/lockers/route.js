import Locker from '@/models/Locker';
import db from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  await db.connect();
  const lockers = await Locker.find({}).sort({ lockerNumber: 1 });
  await db.disconnect();
  return NextResponse.json({ lockers }, { status: 200 });
}

export async function POST() {
  await db.connect();
  const newLocker = new Locker({
    name: 'sample name',
    slug: 'sample-name-' + Math.random(),
    lockerNumber: Math.random(),
    duration: 2,
    status: 'vacant',
    image: '/images/unlocked.jpg',
    price: 10,
  });
  await newLocker.save();
  await db.disconnect();
  return NextResponse.json(
    { message: 'Locker created successfully' },
    { status: 200 }
  );
}
