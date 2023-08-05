// // /api/orders/:id

import { NextResponse } from 'next/server';
import Order from '../../../../models/Order';
import db from '../../../lib/db';

export async function PUT(req, { params }) {
  const orderid = params.id;
  console.log(orderid);
  await db.connect();
  const order = await Order.findById(orderid);
  console.log(order);

  if (order) {
    if (order.isPenaltyPaid) {
      return NextResponse.json(
        { message: 'Error: Penalty is already paid' },
        { status: 400 }
      );
    }
    order.isPenaltyPaid = true;
    order.isPenalty = false;
    order.penaltyPaidAt = Date.now();
    const data = await req.json();
    const { id, status, email_address } = data;
    order.penaltyPaymentResult = {
      id: id,
      status: status,
      email_address: email_address,
    };
    const paidPenaltyOrder = await order.save();
    await db.disconnect();
    return NextResponse.json(
      { message: 'penalty paid successfully', order: paidPenaltyOrder },
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
