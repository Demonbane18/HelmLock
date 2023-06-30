import Locker from '../../../../models/Locker';
import db from '../../../../utils/db';

const handler = async (req, res) => {
  await db.connect();
  const locker = await Locker.findById(req.query.id);
  await db.disconnect();
  res.send(locker);
};

export default handler;
