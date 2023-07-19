import Layout from '../../components/Layout';
import Locker from '../../../models/Locker';
import db from '../../lib/db';
import LockerContext from '../../components/LockerContext';
import { isOpen } from '@/app/lib/time';

export async function generateMetadata({ params }) {
  const { slug } = params;
  await db.connect();
  const locker = await Locker.findOne({ slug }).lean();
  const dlocker = locker ? db.convertDocToObj(locker) : null;
  await db.disconnect();
  return { title: dlocker.name };
}
export default async function LockerScreen({ params }) {
  const { slug } = params;
  await db.connect();
  const locker = await Locker.findOne({ slug }).lean();
  const dlocker = locker ? db.convertDocToObj(locker) : null;
  await db.disconnect();
  const storeIsOpen = await isOpen();
  return (
    <Layout title={dlocker.name}>
      <LockerContext locker={dlocker} isOpen={storeIsOpen} />
    </Layout>
  );
}
