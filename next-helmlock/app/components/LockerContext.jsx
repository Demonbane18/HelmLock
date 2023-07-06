'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Store } from '../../utils/Store';
import getLockerById from '@/app/_actions/getLockerById';
import Cookies from 'js-cookie';

const LockerContext = ({ locker }) => {
  const orderPending = Cookies.get('orderPending');
  console.log(orderPending);
  const { state, dispatch } = useContext(Store);
  const router = useRouter();
  if (!locker) {
    return <div title="Locker Not Found">Locker Not Found</div>;
  }

  // async function getLockerById(id) {
  //   try {
  //     const res = await fetch(`http://localhost:3000/api/lockers/${id}`, {
  //       cache: 'no-store',
  //     });

  //     if (!res.ok) {
  //       throw new Error('Failed to fetch locker');
  //     }

  //     return res.json();
  //   } catch (error) {
  //     console.log('Error loading locker: ', error);
  //   }
  // }
  const addToCartHandler = async () => {
    const existItem = state.cart.cartItems.find((x) => x.slug === locker.slug);
    const quantity = existItem ? existItem.quantity : 1;
    // const { data } = getLockerById(locker._id);
    const data = JSON.parse(JSON.stringify(await getLockerById(locker._id)));
    if (orderPending) {
      return toast.error('You already have a rented locker!');
    }
    if (data?.status === 'occupied') {
      return toast.error('Sorry. Locker is occupied');
    }

    if (state.cart.cartItems.length == 1) {
      return toast.error('You have a pending locker in your cart.');
    }

    dispatch({ type: 'CART_ADD_ITEM', payload: { ...locker, quantity } });
    router.push('/cart');
  };

  return (
    <div>
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
            priority
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
              <div>₱{locker.price}</div>
            </div>
            <div className="mb-2 flex justify-between">
              <div>Status</div>
              <div>{locker.status}</div>
            </div>
            <button
              className="primary-button w-full cursor-pointer"
              onClick={addToCartHandler}
            >
              Rent
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LockerContext;
