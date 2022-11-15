import nc from 'next-connect';
import Locker from '../../../models/Locker';
import db from '../../../utils/db';

const handler = nc();

handler.get(async (req, res) => {
  await db.connect();
  const lockers = await Locker.find({});
  await db.disconnect();
  res.send(lockers);
});

export default handler;
