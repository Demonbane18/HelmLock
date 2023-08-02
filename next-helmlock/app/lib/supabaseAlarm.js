import { createClient } from '@supabase/supabase-js';

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || ''
  //   process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export const updateAlarmStatus = async (alarm_number, servo_status) => {
  const { data: alarm } = await supabaseAdmin
    .from('alarms')
    .select()
    .match({ alarm_number: alarm_number });
  console.log(servo_status);
  console.log(alarm[0].servo_status);
  const { error } = await supabaseAdmin
    .from('alarms')
    .update({ servo_status: servo_status })
    .match({ alarm_number: alarm_number });
  if (error) throw error;
  console.log(error);
  console.log(`Status updated`);
};

export const updateRenterEmail = async (alarm_number, renter_email) => {
  const { error } = await supabaseAdmin
    .from('alarms')
    .update({ renter_email: renter_email })
    .match({ alarm_number: alarm_number });
  if (error) throw error;
  console.log(error);
  console.log(`Renter email updated`);
};
