// // /api/orders/history/:id

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Order from '@/models/Order';
import db from '@/app/lib/db';

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

export async function GET(req, { params }) {
  const userid = params.id;
  console.log(userid);
  await db.connect();
  // const order = await Order.findById(orderid);
  const orders = await Order.find({ user: userid, isPaid: true }).sort({
    _id: -1,
  });
  await db.disconnect();
  // return new Response(`Welcome to my Next application, order: ${order}`);
  return NextResponse.json({ orders }, { status: 200 });
}
