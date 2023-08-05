import bcryptjs from 'bcryptjs';
import User from '@/models/User';
import db from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  if (req.method !== 'POST') {
    return;
  }
  const data = await req.json();
  const { name, email, password } = data;

  if (
    !name ||
    !email ||
    !email.includes('@') ||
    !password ||
    password.trim().length < 5
  ) {
    return NextResponse.json({ message: 'Validation error' }, { status: 422 });
  }

  await db.connect();
  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    await db.disconnect();
    return NextResponse.json(
      { message: 'User exists already!' },
      { status: 422 }
    );
  }

  const newUser = new User({
    name,
    email,
    password: bcryptjs.hashSync(password),
    isAdmin: false,
  });

  const user = await newUser.save();
  await db.disconnect();
  return NextResponse.json(
    {
      message: 'Created user!',
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    { status: 201 }
  );
}

// export { handler as GET, handler as POST };
