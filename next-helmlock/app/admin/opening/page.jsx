import React from 'react';
import db from '@/app/lib/db';
import Day from '@/models/Day';
import ClosedDay from '@/models/ClosedDay';
import Layout from '@/app/components/Layout';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import OpeningHours from '@/app/components/OpeningHours';
import { getDays, getClosedDays } from '@/app/lib/time';

export const revalidate = 60;

export default async function OpeningHourScreen() {
  const session = await getServerSession(authOptions);
  if (!session || (session && !session.user.isAdmin)) {
    redirect(`/signin?callbackUrl=admin/opening`);
  }
  const days = await getDays();
  const closedDays = await getClosedDays();
  return (
    <Layout title="Set Opening Hours">
      <OpeningHours days={days} closedDays={closedDays} />
    </Layout>
  );
}
