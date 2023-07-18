import React from 'react';
import db from '@/app/lib/db';
import Day from '@/models/Day';
import ClosedDay from '@/models/ClosedDay';
import Layout from '@/app/components/Layout';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import OpeningHours from '@/app/components/OpeningHours';

export const revalidate = 60;

export default async function OpeningHourScreen() {
  const session = await getServerSession(authOptions);
  if (!session || (session && !session.user.isAdmin)) {
    redirect(`/signin?callbackUrl=admin/opening`);
  }
  await db.connect();
  const days = await Day.find({});
  const days1 = days.map(db.convertDocToObj);
  const closedDays = await ClosedDay.find({});
  const closedDays1 = closedDays.map(db.convertDocToObj);
  await db.disconnect();

  return (
    <Layout title="Set Opening Hours">
      <OpeningHours days={days1} closedDays={closedDays1} />
    </Layout>
  );
}
