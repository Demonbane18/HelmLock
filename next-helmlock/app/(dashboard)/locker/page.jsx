import React from 'react';
import Layout from '@/app/components/Layout';

function RentedLockerScreen({ params }) {
  const locker = params.orderItems;
  const { name } = locker;
  return <Layout title={name}></Layout>;
}

export default RentedLockerScreen;
