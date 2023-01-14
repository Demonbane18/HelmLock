import React from 'react';
import { useRouter } from 'next/router';

export default function Checkout() {
  const router = useRouter();
  router.push('/login');
  return <div></div>;
}