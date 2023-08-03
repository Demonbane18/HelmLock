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
import { getLockers } from './lib/lockers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const revalidate = 0;

export default async function Home() {
  const lockers = await getLockers();
  const storeIsOpen = await isOpen();
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
    <Layout title="Home Page">
      <StoreContext
        lockers={lockers}
        isOpen={storeIsOpen}
        openTime={convertedOpenTime}
        closeTime={convertedCloseTime}
        isDayClosed={isTodayClosed}
      />
    </Layout>
  );
}
