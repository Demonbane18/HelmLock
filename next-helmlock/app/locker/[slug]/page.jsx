'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useContext } from 'react';
import Layout from '../../components/Layout';
import data from '../../../utils/data';
import { Store } from '../../../utils/Store';

export default function LockerScreen({ params }) {
  const { state, dispatch } = useContext(Store);
  const { slug } = params;
  const router = useRouter();
  const locker = data.lockers.find((x) => x.slug === slug);
  console.log(locker);
  if (!locker) {
    return <div>Locker Not Found</div>;
  }
  const addToCartHandler = () => {
    const existItem = state.cart.cartItems.find((x) => x.slug === locker.slug);
    const quantity = existItem ? existItem.quantity : 1;

    if (locker.status === 'occupied') {
      alert('Sorry. Locker is already occupied.');
      return;
    }
    if (state.cart.cartItems.length === 1) {
      alert("You've already chosen a locker. Please check your cart");
      return;
    }

    dispatch({ type: 'CART_ADD_ITEM', payload: { ...locker, quantity } });
    router.push('/cart');
  };
  return (
    <Layout title={locker.name}>
      <div className="py-2">
        <Link href="/">back to lockers</Link>
      </div>
      <div className="grid md:grid-cols-4 md:gap-3">
        <div className="md:col-span-2">
          <Image
            src={locker.image}
            alt={locker.name}
            width={640}
            height={640}
          ></Image>
        </div>
        <div></div>
        <div>
          <div className="card p-5">
            <div className="mb-2 flex justify-between">
              <h1 className="text-lg font-bold">{locker.name}</h1>
            </div>

            <div className="mb-2 flex justify-between">
              <div>Price</div>
              <div>${locker.price}</div>
            </div>
            <div className="mb-2 flex justify-between">
              <div>Status</div>
              <div>{locker.status}</div>
            </div>
            <button
              className="primary-button w-full"
              onClick={addToCartHandler}
            >
              Rent
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
