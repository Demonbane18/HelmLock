import Order from '@/models/Order';
import Locker from '@/models/Locker';
import User from '@/models/User';
import db from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  await db.connect();
  const ordersCount = await Order.countDocuments();
  const lockersCount = await Locker.countDocuments();
  const usersCount = await User.countDocuments();

  const ordersPriceGroup = await Order.aggregate([
    {
      $group: {
        _id: null,
        sales: { $sum: '$totalPrice' },
      },
    },
  ]);
  const ordersPrice =
    ordersPriceGroup.length > 0 ? ordersPriceGroup[0].sales : 0;

  const salesData = await Order.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        totalSales: { $sum: '$totalPrice' },
      },
    },
  ]);

  await db.disconnect();
  return NextResponse.json(
    { ordersCount, lockersCount, usersCount, ordersPrice, salesData },
    { status: 200 }
  );
}
