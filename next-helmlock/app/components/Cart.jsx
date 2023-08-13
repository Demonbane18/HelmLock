'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useContext } from 'react';
import XCircleIcon from '@heroicons/react/24/outline/XCircleIcon';
import { Store } from '@/utils/Store';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { toast } from 'react-toastify';

import getLockerById from '@/app/_actions/getLockerById';
import { useSession } from 'next-auth/react';

const Cart = ({ lockerDuration }) => {
  const { data: session } = useSession();
  const rentedLocker = session?.user?.rentedLocker;
  const orderPending = rentedLocker ? rentedLocker : null;
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
  const removeItemHandler = (item) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };
  const updateCartHandler = async (item, dur) => {
    const duration = Number(dur);
    if (duration !== 1 && duration < 1) {
      return toast.error('Please pick locker duration');
    }
    const data = JSON.parse(JSON.stringify(await getLockerById(item._id)));
    if (data?.status === 'occupied') {
      dispatch({ type: 'CART_REMOVE_ITEM', payload: item });
      return toast.error('Sorry. Locker is already occupied');
    }
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, duration },
    });
    toast.success('Locker duration updated in the cart');
  };

  return (
    <div>
      <h1 className="mb-4 text-xl">Pending Locker/s</h1>
      {cartItems.length === 0 && !orderPending ? (
        <div>
          Cart is empty. <Link href="/">Pick a Locker</Link>
        </div>
      ) : orderPending ? (
        <div>
          You already have a rented locker.{' '}
          <Link href="/locker">Go to Locker</Link>
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
                  <th className="p-5 text-right">Duration &#40;hr/s&#41;</th>
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
                        passHref
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
                        defaultValue={item.duration}
                        value={item.duration}
                        onChange={(e) =>
                          updateCartHandler(item, e.target.value)
                        }
                      >
                        <option disabled selected value>
                          {' '}
                          -- select an option --{' '}
                        </option>
                        {[...Array(lockerDuration).keys()].map((x) => (
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
                    // router.push('/locker_duration');
                    if (session) {
                      router.push('/locker_duration');
                    } else {
                      router.push('/signin');
                    }
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
    </div>
  );
};

// eslint-disable-next-line no-undef
export default dynamic(() => Promise.resolve(Cart), { ssr: false });
