import Order from '@/models/Order';
import db from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  await db.connect();
  const orders = await Order.find({}).populate('user');
  await db.disconnect();

  return NextResponse.json({ orders }, { status: 200 });
  //   return NextResponse.json({ data }, { status: 200 });
}
