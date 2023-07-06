import Order from '@/models/Order';
import db from '@/app/lib/db';

export async function getOrders(userId) {
  try {
    await db.connect();
    const orders = await Order.find({ user: userId });
    // db.convertDocToObj(order);
    await db.disconnect();
    return orders;
  } catch (error) {
    console.log(error, 'SERVER_ERROR');
  }
}

export default getOrders;
