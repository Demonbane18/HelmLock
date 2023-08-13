'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Store } from '../../utils/Store';
import getLockerById from '@/app/_actions/getLockerById';
import { useSession } from 'next-auth/react';
import Cookies from 'js-cookie';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { getSupaLockerById } from '../lib/lockers';

const LockerContext = ({ locker, isOpen }) => {
  const supabase = createClientComponentClient();
  const [showLocker, setShowLocker] = useState(locker);
  const { data: session } = useSession();
  const userid = session?.user?._id;
  const orderPending = Cookies.get('orderPending' + userid);
  console.log(orderPending);
  const { state, dispatch } = useContext(Store);
  const router = useRouter();
  if (!locker) {
    return <div title="Locker Not Found">Locker Not Found</div>;
  }

  useEffect(() => {
    const channel = supabase
      .channel('IOTHelmlock')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'lockers',
        },
        (payload) => {
          // console.log(payload);
          const updatedData = payload.new;
          const updatedLocker = updatedData.filter(
            (newlocker) => locker.id === newlocker.id
          );
          setShowLocker(updatedLocker);
          router.refresh();
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router]);

  const addToCartHandler = async () => {
    const existItem = state.cart.cartItems.find((x) => x.slug === locker.slug);
    const quantity = existItem ? existItem.quantity : 1;

    const data = JSON.parse(JSON.stringify(await getSupaLockerById(locker.id)));
    if (!isOpen) {
      return toast.error('Store is closed!');
    }
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
            src={showLocker.image}
            alt={showLocker.name}
            width={640}
            height={640}
            priority
          ></Image>
        </div>
        <div></div>
        <div>
          <div className="card p-5">
            <div className="mb-2 flex justify-between">
              <h1 className="text-lg font-bold">{showLocker.name}</h1>
            </div>

            <div className="mb-2 flex justify-between">
              <div>Price</div>
              <div>₱{showLocker.price}</div>
            </div>
            <div className="mb-2 flex justify-between">
              <div>Status</div>
              <div>{showLocker.status}</div>
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
