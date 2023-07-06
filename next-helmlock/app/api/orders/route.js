// import { getSession } from 'next-auth/react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import Order from '../../../models/Order';
import db from '../../lib/db';
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

// export async function GET(req, res) {
//   const orderid = req.nextUrl.searchParams.get('id');
//   // const orderid = '64a3cb0768f02015579b0b8d';
//   const session = await getServerSession(
//     req,
//     {
//       ...res,
//       getHeader: (name) => res.headers?.get(name),
//       setHeader: (name, value) => res.headers?.set(name, value),
//     },
//     authOptions
//   );
//   if (!session) {
//     return NextResponse.status(401).send('signin required');
//   }
//   await db.connect();
//   // const order = await Order.findById(orderid);
//   const order = await Order.findOne({ _id: orderid });
//   await db.disconnect();
//   return NextResponse.json({ order }, { status: 200 });
// }

export async function POST(req, res) {
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
    return NextResponse.json(
      { message: 'You must be logged in.' },
      { status: 401 }
    );
  }
  const { user } = session;
  const { orderItems, lockerDuration, paymentMethod, totalPrice } =
    await req.json();
  try {
    await db.connect();
    const newOrder = new Order({
      orderItems,
      lockerDuration,
      paymentMethod,
      totalPrice,
      user: user._id,
    });
    const order = await newOrder.save();
    return NextResponse.json(order);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      let errorList = [];
      for (let e in error.errors) {
        errorList.push(error.errors[e].message);
      }
      console.log(errorList);
      return NextResponse.json({ msg: errorList });
    } else {
      return NextResponse.json({ msg: ['Unable to create order.'] });
    }
  }
}

// export async function GET(request) {
//   // username parent route
//   return new Response('This is my parent route');
// }
