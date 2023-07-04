'use server';
import Order from '../models/Order';
import db from '../app/lib/db';
const getOrderById = async (orderId) => {
  try {
    await db.connect();
    const order = await Order.findById(orderId);
    // db.convertDocToObj(order);
    await db.disconnect();
    return order;
  } catch (error) {
    console.log(error, 'SERVER_ERROR');
  }
};

export default getOrderById;
