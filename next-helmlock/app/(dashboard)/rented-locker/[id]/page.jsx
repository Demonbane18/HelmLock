import Layout from '@/app/components/Layout';
import Locker from '@/models/Locker';
import Order from '@/models/Order';
import db from '@/app/lib/db';
import LockerControl from '@/app/components/LockerControl';
import React from 'react';
import Cookies from 'js-cookie';
// import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
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
  // const supabase = createServerComponentClient({ Cookies });
  await db.connect();
  const order = await Order.findOne({ _id: orderid }).lean();
  const { orderItems, isEnded, user, isPaid } = order;
  const lockerid = orderItems[0]._id;
  const locker = await Locker.findOne({ _id: lockerid });
  const dlocker = locker ? JSON.parse(JSON.stringify(locker)) : null;
  await db.disconnect();
  // const { status } = await supabase
  //   .from('servo_table')
  //   .select('status')
  //   .eq('servo_number', dlocker.lockerNumber);
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
            // lockerStatus={status}
          />
        ) : (
          <div>
            Haven't rented a locker yet. <Link href="/">Rent a Locker</Link>
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
