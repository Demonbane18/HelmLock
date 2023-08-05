import Order from '@/models/Order';
import db from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  //   const data = await req.json();
  //   const { session } = data;
  //   console.log(data);
  //   //   const { session } = params;
  //   if (!session || (session && !session.user.isAdmin)) {
  //     return NextResponse.json(
  //       { message: 'Sign in required or not an admin' },
  //       { status: 401 }
  //     );
  //   }
  await db.connect();
  const orders = await Order.find({}).populate('user', 'name');
  await db.disconnect();

  return NextResponse.json({ orders }, { status: 200 });
  //   return NextResponse.json({ data }, { status: 200 });
}
