import Locker from '../../models/Locker';
import User from '../../models/User';
import data from '../../utils/data';
import db from '../../app/lib/db';

const handler = async (req, res) => {
  await db.connect();
  await User.deleteMany();
  await User.insertMany(data.users);
  await Locker.deleteMany();
  await Locker.insertMany(data.lockers);
  await db.disconnect();
  res.send({ message: 'seeded successfully' });
};
export default handler;
