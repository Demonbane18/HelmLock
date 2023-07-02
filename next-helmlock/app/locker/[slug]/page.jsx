import Layout from '../../components/Layout';
import Locker from '../../../models/Locker';
import db from '../../../utils/api/db';
import LockerContext from '../../components/LockerContext';

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
  return (
    <Layout title={dlocker.name}>
      <LockerContext locker={dlocker} />
    </Layout>
  );
}
