import nc from 'next-connect';
import Locker from '../../models/Locker';
import db from '../../utils/db';
import data from '../../utils/data';

const handler = nc();

handler.get(async (req, res) => {
  await db.connect();
  await Locker.deleteMany();
  await Locker.insertMany(data.lockers);
  await db.disconnect();
  res.send({ message: 'seeded successfully' });
});

export default handler;
