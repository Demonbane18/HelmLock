import Layout from '@/app/components/Layout';
import Locker from '@/models/Locker';
import Order from '@/models/Order';
import db from '@/app/lib/db';
import LockerControl from '@/app/components/LockerControl';
import React from 'react';

export async function generateMetadata({ params }) {
  const orderid = params.id;
  console.log(orderid);
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
  await db.connect();
  const order = await Order.findOne({ _id: orderid }).lean();
  const { orderItems } = order;
  const lockerid = orderItems[0]._id;
  const locker = await Locker.findOne({ _id: lockerid });
  const dlocker = locker ? db.convertDocToObj(locker) : null;
  console.log(dlocker);
  await db.disconnect();
  return (
    <Layout title={dlocker.name}>
      {dlocker ? (
        <LockerControl locker={dlocker} />
      ) : (
        <div>
          Haven't rented a locker yet. <Link href="/">Rent a Locker</Link>
        </div>
      )}
    </Layout>
  );
}
