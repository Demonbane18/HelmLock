import Locker from '@/models/Locker';
import db from './db';

export const getLockers = async () => {
  await db.connect();
  const data = await Locker.find().lean().sort({ lockerNumber: 1 });
  const lockers = data.map(db.convertDocToObj);
  await db.disconnect();
  return lockers;
};
