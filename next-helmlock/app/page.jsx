//server side
import Layout from './components/Layout';
import StoreContext from './components/StoreContext';
import {
  isOpen,
  getCurrentOpenTime,
  getCurrentClosingTime,
  convertTime,
  isDayClosed,
} from './lib/time';
import { getLockers, getRentedLocker } from './lib/lockers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import Cookies from 'js-cookie';

export const revalidate = 0;

export default async function Home() {
  const session = await getServerSession(authOptions);
  console.log(session);
  const userid = session?.user?._id;
  const lockers = await getLockers();
  const orderid = await getRentedLocker(userid);
  console.log(orderid);
  const storeIsOpen = await isOpen();
  const currDate = new Date();
  const openTime = await getCurrentOpenTime();
  const closeTime = await getCurrentClosingTime();
  const isTodayClosed = await isDayClosed();
  // console.log(isTodayClosed);
  const convertedOpenTime = convertTime(openTime);
  const convertedCloseTime = convertTime(closeTime);
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log(user);

  return (
    <Layout title="Home Page" renterid={orderid}>
      <StoreContext
        lockers={lockers}
        isOpen={storeIsOpen}
        openTime={convertedOpenTime}
        closeTime={convertedCloseTime}
        isDayClosed={isTodayClosed}
        currDate={currDate}
      />
    </Layout>
  );
}
