import db from '@/app/lib/db';
import Order from '@/models/Order';

export const getOrderLocker = async (user) => {
  console.log(user);
  await db.connect();
  const { orderedLocker } = await Order.findOne({ user: user, isPaid: true });
  console.log(orderedLocker);
  const orderId = orderedLocker._id;
  console.log(orderId);
  await db.disconnect();
  return orderId;
};
