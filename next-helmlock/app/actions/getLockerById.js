'use server';
import Locker from '../../models/Locker';
import db from '../../utils/api/db';
const getLockerById = async (lockerId) => {
  // const lockers = await Locker.find().lean();
  // const dlockers = lockers.map(db.convertDocToObj);

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
