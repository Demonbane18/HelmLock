// // /api/orders/:id

import { NextResponse } from 'next/server';
import Order from '../../../../models/Order';
import Locker from '@/models/Locker';
import db from '../../../lib/db';

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
  console.log(orderid);
  await db.connect();
  const order = await Order.findById(orderid);
  console.log(order);
  const { orderItems } = order;
  console.log(orderItems);
  const lockerid = orderItems[0]._id;
  console.log(lockerid);
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
    const locker = await Locker.findById(lockerid);
    locker.status = 'occupied';
    await locker.save();
    const paidOrder = await order.save();
    console.log(paidOrder);
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
