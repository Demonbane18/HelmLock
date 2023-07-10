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
  const { orderItems, isEnded, user, isPaid } = order;
  const lockerid = orderItems[0]._id;
  const locker = await Locker.findOne({ _id: lockerid });
  const dlocker = locker ? JSON.parse(JSON.stringify(locker)) : null;
  await db.disconnect();
  const simpleId = user.toString();
  const simpleOrderId = orderid.toString();
  // const lockerData = await locker.toArray();
  // const simpleLockerArray = lockerData.map((data) => ({
  //   _id: data._id.toString(), // convert ObjectId to string
  //   name: data.name,
  //   slug: data.slug,
  //   duration: data.duration,
  //   status: data.status,
  //   image: data.image,
  //   price: data.price,
  // }));

  return (
    <Layout title={dlocker.name}>
      {!isEnded && isPaid ? (
        dlocker ? (
          <LockerControl
            locker={dlocker}
            orderuser={simpleId}
            orderid={simpleOrderId}
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
