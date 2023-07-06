// // /api/orders/:id

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import Order from '../../../../models/Order';
import db from '../../../lib/db';

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
  const orderid = params.id;
  await db.connect();
  // const order = await Order.findById(orderid);
  const order = await Order.findOne({ _id: orderid });
  await db.disconnect();
  // return new Response(`Welcome to my Next application, order: ${order}`);
  return NextResponse.json({ order }, { status: 200 });
}

export async function PUT(req, { params }) {
  const orderid = params.id;
  await db.connect();
  const order = await Order.findById(orderid);
  if (order) {
    if (order.isPaid) {
      return NextResponse.json(
        { message: 'Error: order is already paid' },
        { status: 400 }
      );
    }
    order.isPaid = true;
    order.paidAt = Date.now();
    const data = await req.json();
    const { id, status, email_address } = data;
    order.paymentResult = {
      id: id,
      status: status,
      email_address: email_address,
    };
    const paidOrder = await order.save();
    await db.disconnect();
    return NextResponse.json(
      { message: 'order paid successfully', order: paidOrder },
      { status: 200 }
    );
  } else {
    await db.disconnect();
    return NextResponse.json(
      { message: 'Error: order not found' },
      { status: 404 }
    );
  }
}
