import Layout from '@/app/components/Layout';
import Locker from '@/models/Locker';
import Order from '@/models/Order';
import db from '@/app/lib/db';
import LockerControl from '@/app/components/LockerControl';
import React from 'react';
import { getServoLock } from '@/app/lib/servoLocks';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
export const revalidate = 0;

export async function generateMetadata({ params }) {
  const orderid = params.id;
  await db.connect();
  const order = await Order.findOne({ _id: orderid }).lean();
  const { orderItems } = order;
  const lockerid = orderItems[0]._id;
  const locker = await Locker.findOne({ _id: lockerid });
  const dlocker = locker ? db.convertDocToObj(locker) : null;
  await db.disconnect();
  return { title: dlocker.name };
}
export default async function LockerScreen({ params }) {
  const orderid = params.id;
  const supabase = createServerComponentClient({ cookies });
  await db.connect();
  const order = await Order.findOne({ _id: orderid }).lean();
  const { orderItems, isEnded, user, isPaid, lockerDuration } = order;
  const endTime = lockerDuration.endTime;
  const lockerid = orderItems[0]._id;
  const locker = await Locker.findOne({ _id: lockerid });
  const dlocker = locker ? JSON.parse(JSON.stringify(locker)) : null;
  const status = await getServoLock(dlocker.lockerNumber);
  await db.disconnect();
  const { data: alarm } = await supabase
    .from('alarms')
    .select()
    .match({ alarm_number: dlocker.lockerNumber });
  const alarmStatus = alarm[0].status;
  console.log(alarm);
  const simpleId = user.toString();
  const simpleOrderId = orderid.toString();
  return (
    <Layout title={dlocker.name}>
      {!isEnded && isPaid ? (
        dlocker ? (
          <LockerControl
            locker={dlocker}
            orderuser={simpleId}
            orderid={simpleOrderId}
            lockerStatus={status}
            alarmStatus={alarmStatus}
            endTime={endTime}
          />
        ) : (
          <div>
            Haven&apos;t rented a locker yet.{' '}
            <Link href="/">Rent a Locker</Link>
          </div>
        )
      ) : (
        <div>
          Invalid Locker. Locker already ended or unpaid.{' '}
          <Link href="/">Rent a Locker</Link>
        </div>
      )}
    </Layout>
  );
}
