import { getServerSession } from 'next-auth/react';
import { authOptions } from '../[...nextauth]/route';
import bcryptjs from 'bcryptjs';
import User from '@/models/User';
import db from '@/app/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req, res) {
  //   const session = await getServerSession(req, res, authOptions);

  //   if (!session) {
  //     return NextResponse.json(
  //       { message: 'You must be logged in.' },
  //       { status: 401 }
  //     );
  //   }

  //   const userid = session.user._id;
  const data = await req.json();
  const { name, email, password, userid } = data;

  if (
    !name ||
    !email ||
    !email.includes('@') ||
    (password && password.trim().length < 5)
  ) {
    return NextResponse.json({ message: 'Validation error' }, { status: 422 });
  }
  await db.connect();
  const toUpdateUser = await User.findById(userid);
  toUpdateUser.name = name;
  toUpdateUser.email = email;

  if (password) {
    toUpdateUser.password = bcryptjs.hashSync(password);
  }

  await toUpdateUser.save();
  await db.disconnect();
  return NextResponse.json({ message: 'User updated' }, { status: 200 });
}

// export async function PUT(req, res) {
//   const session = await getServerSession(
//     // req,
//     // {
//     //   ...res,
//     //   getHeader: (name) => res.headers?.get(name),
//     //   setHeader: (name, value) => res.headers?.set(name, value),
//     // },
//     authOptions
//   );
//   if (!session) {
//     return NextResponse.json(
//       { message: 'You must be logged in.' },
//       { status: 401 }
//     );
//   }
//   const userid = session.user._id;
//   const { name, email, password } = req.json();

//   if (
//     !name ||
//     !email ||
//     !email.includes('@') ||
//     (password && password.trim().length < 5)
//   ) {
//     return NextResponse.json({ message: 'Validation error' }, { status: 422 });
//   }
//   await db.connect();
//   const toUpdateUser = await User.findById(userid);
//   toUpdateUser.name = name;
//   toUpdateUser.email = email;

//   if (password) {
//     toUpdateUser.password = bcryptjs.hashSync(password);
//   }

//   await toUpdateUser.save();
//   await db.disconnect();
//   return NextResponse.json({ message: 'User updated' }, { status: 200 });
// }
