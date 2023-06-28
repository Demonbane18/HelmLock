'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useContext } from 'react';
import XCircleIcon from '@heroicons/react/24/outline/XCircleIcon';
import Layout from '../../components/Layout';
import { Store } from '../../../utils/Store';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { opening } from '../../../utils/opening';

function CartScreen() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
  const removeItemHandler = (item) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };
  const updateCartHandler = (item, dur) => {
    const duration = Number(dur);
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, duration },
    });
  };

  return (
    <Layout title="Shopping Cart">
      <h1 className="mb-4 text-xl">Pending Locker/s</h1>
      {cartItems.length === 0 ? (
        <div>
          Cart is empty. <Link href="/">Pick a Locker</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <table className="min-w-full ">
              <thead className="border-b">
                <tr>
                  <th className="p-5 text-left">Locker Number</th>
                  <th className="p-5 text-right" hidden>
                    Duration
                  </th>
                  <th className="p-5 text-right">Duration</th>
                  <th className="p-5 text-right">Price</th>
                  <th className="p-5">Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.slug} className="border-b">
                    <td>
                      <Link
                        href={`/locker/${item.slug}`}
                        className="flex items-center"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={50}
                          height={50}
                          style={{
                            maxWidth: '100%',
                            height: 'auto',
                          }}
                        ></Image>
                        {item.name}
                      </Link>
                    </td>
                    <td className="p-5 text-right">
                      <select
                        value={item.duration ? item.duration : 1}
                        onChange={(e) =>
                          updateCartHandler(item, e.target.value)
                        }
                      >
                        {[...Array(opening()).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-5 text-right">₱{item.price}</td>
                    <td className="p-5 text-center">
                      <button onClick={() => removeItemHandler(item)}>
                        <XCircleIcon className="h-5 w-5"></XCircleIcon>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card p-5">
            <ul>
              <li>
                <div className="pb-3 text-xl">
                  Subtotal (
                  {cartItems.reduce((a, c) => a + c.duration, 0)
                    ? cartItems.reduce((a, c) => a + c.duration, 0)
                    : 10}
                  ) : ₱
                  {cartItems.reduce((a, c) => a + c.duration * c.price, 0)
                    ? cartItems.reduce((a, c) => a + c.duration * c.price, 0)
                    : 10}
                </div>
              </li>
              <li>
                <button
                  onClick={(e) => {
                    e.preventDefault;
                    router.push('/locker_duration');
                    // if (session?.user) {
                    // router.push('/locker_duration');
                    // }
                    // router.push('/signin');
                  }}
                  className="primary-button w-full"
                >
                  Check Out
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });
