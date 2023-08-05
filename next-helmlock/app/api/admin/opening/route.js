import Day from '@/models/Day';
import ClosedDay from '@/models/ClosedDay';
import db from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  await db.connect();
  const days = await Day.find({});
  await db.disconnect();
  return NextResponse.json({ days }, { status: 200 });
}

export async function PUT(req) {
  const data = await req.json();
  const { days } = data;
  // const { id, openTime, closeTime } = data;
  await db.connect();
  const newDay = await Day.find({});
  if (newDay) {
    await Day.findByIdAndUpdate(days[0].id, {
      openTime: days[0].openTime,
      closeTime: days[0].closeTime,
    });
    await Day.findByIdAndUpdate(days[1].id, {
      openTime: days[1].openTime,
      closeTime: days[1].closeTime,
    });
    await Day.findByIdAndUpdate(days[2].id, {
      openTime: days[2].openTime,
      closeTime: days[2].closeTime,
    });
    await Day.findByIdAndUpdate(days[3].id, {
      openTime: days[3].openTime,
      closeTime: days[3].closeTime,
    });
    await Day.findByIdAndUpdate(days[4].id, {
      openTime: days[4].openTime,
      closeTime: days[4].closeTime,
    });
    await Day.findByIdAndUpdate(days[5].id, {
      openTime: days[5].openTime,
      closeTime: days[5].closeTime,
    });
    await Day.findByIdAndUpdate(days[6].id, {
      openTime: days[6].openTime,
      closeTime: days[6].closeTime,
    });
    await db.disconnect();
    return NextResponse.json(
      { message: 'Opening hours saved' },
      { status: 200 }
    );
  } else {
    await db.disconnect();
    return NextResponse.json({ message: 'Day not found' }, { status: 404 });
  }
}

export async function POST(req) {
  const data = await req.json();
  const { date } = data;
  console.log('server date');
  console.log(date.date);
  await db.connect();
  const newClosedDay = new ClosedDay({ date: date.date });
  await newClosedDay.save();
  await db.disconnect();
  return NextResponse.json({ message: 'Opening hours saved' }, { status: 200 });
}

export async function DELETE(req) {
  const data = await req.json();
  const { date } = data;
  console.log('server date');
  console.log(date.date);
  await db.connect();
  const closedDay = await ClosedDay.findOne({ date: date.date });
  console.log(closedDay);
  await closedDay.deleteOne();
  await db.disconnect();
  return NextResponse.json({ message: 'Opening hours saved' }, { status: 200 });
}
