// // /api/orders/:id

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import Order from '../../../../models/Order';
import db from '../../../lib/db';

export async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ message: 'You must be logged in.' });
    return;
  }

  return res.json({
    message: 'Success',
  });
}
export async function GET(req, { params }) {
  // const session = await getServerSession(
  //   req,
  //   {
  //     ...res,
  //     getHeader: (name) => res.headers?.get(name),
  //     setHeader: (name, value) => res.headers?.set(name, value),
  //   },
  //   authOptions
  // );
  // if (!session) {
  //   return NextResponse.status(401).send('signin required');
  // }
  const orderid = params.id;
  await db.connect();
  // const order = await Order.findById(orderid);
  const order = await Order.findOne({ _id: orderid });
  await db.disconnect();
  // return new Response(`Welcome to my Next application, order: ${order}`);
  return NextResponse.json({ order }, { status: 200 });
}
