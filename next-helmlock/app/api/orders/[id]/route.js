// /api/orders/:id

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import Order from '../../../../models/Order';
import db from '../../../lib/db';

export async function GET(req, res, { params }) {
  // const orderid = params.id;
  const orderid = '64a3cb0768f02015579b0b8d';
  const session = await getServerSession(
    req,
    {
      ...res,
      getHeader: (name) => res.headers?.get(name),
      setHeader: (name, value) => res.headers?.set(name, value),
    },
    authOptions
  );
  if (!session) {
    return NextResponse.status(401).send('signin required');
  }
  await db.connect();
  // const order = await Order.findById(orderid);
  const order = await Order.findOne({ _id: orderid });
  await db.disconnect();
  return NextResponse.json(order);
}
