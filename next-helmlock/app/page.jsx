//server side
import Layout from './components/Layout';
import Locker from '../models/Locker';
import db from '../utils/api/db';
import StoreContext from './components/StoreContext';

export default async function Home() {
  await db.connect();
  const lockers = await Locker.find().lean();
  const dlockers = lockers.map(db.convertDocToObj);
  await db.disconnect();
  return (
    <Layout title="Home Page">
      <StoreContext lockers={dlockers} />
    </Layout>
  );
}
