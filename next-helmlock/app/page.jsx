import Layout from './components/Layout';
import LockerItem from './components/Lockeritem';
import data from './utils/data';

export default function Home() {
  return (
    <Layout title="Home Page">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-3">
        {data.lockers.map((locker) => (
          <LockerItem locker={locker} key={locker.slug}></LockerItem>
        ))}
      </div>
    </Layout>
  );
}
