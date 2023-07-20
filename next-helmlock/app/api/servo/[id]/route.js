import db from '@/app/lib/db';
import ServoLock from '@/models/ServoLock';
import { NextResponse } from 'next/server';

export async function PUT(req, { params }) {
  const servo_number = params.id;
  await db.connect();
  const servoLock = await ServoLock.findOne({ servo_number });
  if (servoLock) {
    if (servoLock.status === 'open') {
      servoLock.status = 'close';
    } else {
      servoLock.status = 'open';
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
