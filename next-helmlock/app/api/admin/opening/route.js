import { getServerSession } from 'next-auth/react';
import Day from '@/models/Day';
import ClosedDay from '@/models/ClosedDay';
import db from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req, res) {
  await db.connect();
  const days = await Day.find({});
  await db.disconnect();
  return NextResponse.json({ days }, { status: 200 });
}

// export async function PUT(req, { params }) {
//   const data = await req.json();
//   const { name, slug, price, image, lockerNumber } = data;
//   await db.connect();
//   const locker = await Locker.findById(params.id);
//   if (locker) {
//     locker.name = name;
//     locker.slug = slug;
//     locker.lockerNumber = lockerNumber;
//     locker.price = price;
//     locker.image = image;
//     await locker.save();
//     await db.disconnect();
//     return NextResponse.json(
//       { message: 'Locker updated successfully' },
//       { status: 200 }
//     );
//   } else {
//     await db.disconnect();
//     return NextResponse.json({ message: 'Locker not found' }, { status: 404 });
//   }
// }
