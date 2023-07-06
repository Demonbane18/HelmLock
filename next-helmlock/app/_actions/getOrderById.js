'use server';
import Order from '../../models/Order';
import db from '../lib/db';
export async function getOrderById(orderId) {
  try {
    await db.connect();
    const order = await Order.findById(orderId);
    // db.convertDocToObj(order);
    await db.disconnect();
    return order;
  } catch (error) {
    console.log(error, 'SERVER_ERROR');
  }
}
