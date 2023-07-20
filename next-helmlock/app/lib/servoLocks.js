import db from '@/app/lib/db';
import ServoLock from '@/models/ServoLock';

export const getServoLock = async (servo_number) => {
  await db.connect();
  const { status } = await ServoLock.findOne({ servo_number });
  await db.disconnect();
  return status;
};
