'use client';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useContext } from 'react';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import Locker from '../../../models/Locker';
import db from '../../../utils/db';
import { Store } from '../../../utils/Store';

export default function LockerScreen({ params }) {
  const { locker } = params;
  const { state, dispatch } = useContext(Store);
  const router = useRouter();

  console.log(locker);
  if (!locker) {
    return <Layout title="Locker Not Found">Locker Not Found</Layout>;
  }
  const addToCartHandler = async () => {
    const existItem = state.cart.cartItems.find((x) => x.slug === locker.slug);
    const quantity = existItem ? existItem.quantity : 1;
    const { data } = await axios.get(`/api/lockers/${locker._id}`);

    if (data.locker.status === 'occupied') {
      return toast.error('Sorry. Locker is occupied');
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
export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;
  await db.connect();
  const locker = await Locker.findOne({ slug }).lean();
  await db.disconnect();
  return {
    props: {
      locker: locker ? db.convertDocToObj(locker) : null,
    },
  };
}
