import User from '@/models/User';
import db from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function DELETE(req, { params }) {
  const userid = params.id;
  await db.connect();
  const user = await User.findById(userid);
  if (user) {
    if (user.email === 'admin@example.com') {
      return NextResponse.json(
        { message: 'Can not delete admin' },
        { status: 400 }
      );
    }
    await user.deleteOne();
    await db.disconnect();
    return NextResponse.json({ message: 'User deleted' }, { status: 200 });
  } else {
    await db.disconnect();
    return NextResponse.json({ message: 'User Not Found' }, { status: 404 });
  }
}
