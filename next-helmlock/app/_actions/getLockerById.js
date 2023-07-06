'use server';
import Locker from '../../models/Locker';
import db from '../lib/db';
const getLockerById = async (lockerId) => {
  try {
    await db.connect();
    const locker = await Locker.findById(lockerId);
    // const dlocker = db.convertDocToObj(locker);
    await db.disconnect();
    return locker;
  } catch (error) {
    console.log(error, 'SERVER_ERROR');
  }
};

export default getLockerById;
