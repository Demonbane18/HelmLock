import Locker from '@/models/Locker';
import Order from '@/models/Order';
import db from './db';

import { createClient } from '@supabase/supabase-js';

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || ''
  //   process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export const getLockers = async () => {
  await db.connect();
  const data = await Locker.find().lean().sort({ lockerNumber: 1 });
  const lockers = data.map(db.convertDocToObj);
  await db.disconnect();
  return lockers;
};

export const getRentedLocker = async (userid) => {
  await db.connect();
  const data = await Order.findOne({
    isPaid: true,
    user: userid,
    isEnded: false,
  });
  const orderid = data ? data._id.toString() : null;
  console.log(orderid);
  await db.disconnect();
  return orderid;
};

export const getSupaLockers = async () => {
  const { data: lockers } = await supabaseAdmin
    .from('lockers')
    .select()
    .order('locker_number');
  return lockers;
};

export const getSupaLockerById = async (id) => {
  const { data: locker } = await supabaseAdmin
    .from('lockers')
    .select()
    .match({ id });
  return locker;
};

export const updateLockerStatus = async (name, locker_status) => {
  const { data: locker } = await supabaseAdmin
    .from('lockers')
    .select()
    .match({ name: name });
  console.log(locker_status);
  console.log(locker[0].status);
  const { error } = await supabaseAdmin
    .from('lockers')
    .update({ status: locker_status })
    .match({ name: name });
  if (error) throw error;
  console.log(error);
  console.log(`Status updated`);
};
