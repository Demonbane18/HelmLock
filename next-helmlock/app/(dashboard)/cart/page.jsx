import React from 'react';
import Cart from '@/app/components/Cart';
import { getDuration } from '@/app/lib/time';
import Layout from '@/app/components/Layout';

export function generateMetadata() {
  return {
    title: 'Cart',
  };
}

export default async function CartScreen() {
  const duration = await getDuration();
  return (
    <Layout title="Cart">
      <Cart lockerDuration={duration} />
    </Layout>
  );
}
