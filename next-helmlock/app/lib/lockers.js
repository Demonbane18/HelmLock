import Locker from '@/models/Locker';
import Order from '@/models/Order';
import db from './db';

export const getLockers = async () => {
  await db.connect();
  const data = await Locker.find().lean().sort({ lockerNumber: 1 });
  const lockers = data.map(db.convertDocToObj);
  await db.disconnect();
  return lockers;
};

export const getRentedLocker = async (userid) => {
  await db.connect();
  const data = await Order.findOne({
    isPaid: true,
    user: userid,
    isEnded: false,
  });
  const orderid = data ? data._id.toString() : null;
  console.log(orderid);
  await db.disconnect();
  return orderid;
};
