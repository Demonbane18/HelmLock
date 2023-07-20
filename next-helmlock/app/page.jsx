//server side
import Layout from './components/Layout';
import Locker from '../models/Locker';
import db from './lib/db';
import StoreContext from './components/StoreContext';
import {
  isOpen,
  getCurrentOpenTime,
  getCurrentClosingTime,
  convertTime,
  isDayClosed,
} from './lib/time';
import { getLockers } from './lib/lockers';
import { formatISO, format } from 'date-fns';
export const revalidate = 60;

export default async function Home() {
  const lockers = await getLockers();
  const storeIsOpen = await isOpen();
  const openTime = await getCurrentOpenTime();
  const closeTime = await getCurrentClosingTime();
  const isTodayClosed = await isDayClosed();
  // console.log(isTodayClosed);
  const convertedOpenTime = convertTime(openTime);
  const convertedCloseTime = convertTime(closeTime);
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
