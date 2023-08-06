import data from '../../utils/data';
import db from '../../app/lib/db';
import Locker from '@/models/Locker';
import ServoLock from '@/models/ServoLock';
import User from '@/models/User';

const handler = async (req, res) => {
  await db.connect();
  // await User.deleteMany();
  // await User.insertMany(data.users);
  await Locker.deleteMany();
  await Locker.insertMany(data.lockers);
  // await Day.deleteMany();
  // await Day.insertMany(data.days);
  // await ClosedDay.deleteMany();
  // await ClosedDay.insertMany(data.closedDays);
  // await ServoLock.deleteMany();
  // await ServoLock.insertMany(data.servoLocks);
  await db.disconnect();
  res.send({ message: 'seeded successfully' });
};
export default handler;
