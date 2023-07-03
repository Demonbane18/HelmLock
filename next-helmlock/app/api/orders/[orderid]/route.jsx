// /api/orders/:id
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import Order from '../../../../models/Order';
import db from '../../../lib/db';

export async function GET(req, res, { params }) {
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

  try {
    await db.connect();
    const order = await Order.findById(params.orderid);
    await db.disconnect();
    return NextResponse.json(order);
  } catch (error) {
    console.log(error, 'SERVER ERROR');
    return null;
  }
}
