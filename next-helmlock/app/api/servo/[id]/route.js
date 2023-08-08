import db from '@/app/lib/db';
import ServoLock from '@/models/ServoLock';
import Order from '@/models/Order';
import Locker from '@/models/Locker';
import { NextResponse } from 'next/server';

export async function PUT(req, { params }) {
  const servo_number = params.id;
  await db.connect();
  const servoLock = await ServoLock.findOne({ servo_number });
  const data = await req.json();
  const { orderid, lockerid } = data;
  const order = await Order.findOne({ _id: orderid });
  const locker = await Locker.findOne({ _id: lockerid });

  if (servoLock) {
    if (servoLock.status === 'open') {
      servoLock.status = 'close';
    } else {
      servoLock.status = 'open';
      order.isEnded = true;
      order.endedAt = Date.now();
      order.save();
      locker.status = 'vacant';
      locker.save();
    }
    servoLock.save();
    await db.disconnect();
    if (servoLock.status === 'open') {
      return NextResponse.json(
        {
          message: 'Locker is successfully checked out.',
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: 'Locker is now closed!' },
        { status: 200 }
      );
    }
  } else {
    return NextResponse.json(
      { message: 'ServoLock not found!' },
      { status: 404 }
    );
  }
}
