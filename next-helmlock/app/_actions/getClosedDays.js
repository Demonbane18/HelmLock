import ClosedDay from '@/models/ClosedDay';
import db from '@/app/lib/db';

export async function getClosedDays() {
  try {
    await db.connect();
    const closedDays = await ClosedDay.find({});
    db.convertDocToObj(closedDays);
    await db.disconnect();
    return closedDays;
  } catch (error) {
    console.log(error, 'SERVER_ERROR');
  }
}

export default getClosedDays;
