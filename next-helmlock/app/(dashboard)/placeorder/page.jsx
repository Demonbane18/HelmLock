'use client';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import CheckoutWizard from '../../components/CheckoutWizard';
import Layout from '../../components/Layout';
import { getError } from '../../../utils/error';
import { Store } from '../../../utils/Store';
import { currentTime, updatedTime } from '../../../utils/helper';
import useRedirectAfterSomeSeconds from '../../../utils/redirect';
import { Metadata } from 'next';

export function generateMetadata() {
  return {
    title: 'Place Order',
  };
}
export default function PlaceOrderScreen() {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { cartItems, lockerDuration, paymentMethod } = cart;
  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;

  const [loading, setLoading] = useState(false);
  const [cartIsEmpty, setCartIsEmpty] = useState('empty');
  const itemsPrice = round2(
    cartItems.reduce((a, c) => a + c.duration * c.price, 0)
  ); // 123.4567 => 123.46

  const totalPrice = round2(itemsPrice);

  const router = useRouter();
  useEffect(() => {
    const customId = 'custom-id-yes';
    toast.warning(
      'You will be redirected back to home page in a minute. Please place your order',
      {
        toastId: customId,
      },
      { autoClose: 15000 }
    );

    if (!paymentMethod) {
      router.push('/payment');
    }
  }, [paymentMethod, router]);

  useEffect(() => {
    if (cartItems.length !== 0) {
      setCartIsEmpty('not empty');
    }
  }, []);

  const { secondsRemaining } = useRedirectAfterSomeSeconds('/', 60);

  const placeOrderHandler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post('/api/orders', {
        orderItems: cartItems,
        lockerDuration,
        paymentMethod,
        totalPrice,
      });

      console.log('placeorder');

      console.log(data);
      setLoading(false);
      dispatch({ type: 'CART_CLEAR_ITEMS' });
      Cookies.set('orderPending', true, { expires: 1 });
      Cookies.set(
        'cart',
        JSON.stringify({
          ...cart,
          cartItems: [],
          lockerDuration,
        })
      );
      router.refresh();
      router.push(`/order/${data._id}`);
    } catch (err) {
      setLoading(false);
      toast.error(getError(err));
    }
  };

  return (
    <Layout title="Place Order">
      <CheckoutWizard activeStep={3} />
      <h1 className="mb-4 text-xl">Place Order</h1>
      {cartIsEmpty === 'empty' ? (
        <div>
          Cart is empty.{' '}
          <Link href="/" id="link">
            Go pick a locker
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <div className="card  p-5">
              <h2 className="mb-2 text-lg">Locker Duration</h2>
              <div>
                <p>
                  Duration: {lockerDuration.duration} hour
                  {lockerDuration.duration !== 1 ? 's' : null}
                </p>
                <p>Start Time: {lockerDuration.startTime}</p>
                <p>End Time {lockerDuration.endTime}</p>
              </div>
              <div>
                <Link href="/locker_duration">Edit</Link>
              </div>
            </div>
            <div className="card  p-5">
              <h2 className="mb-2 text-lg">Payment Method</h2>
              <div>{paymentMethod}</div>
              <div>
                <Link href="/payment">Edit</Link>
              </div>
            </div>
            <div className="card overflow-x-auto p-5">
              <h2 className="mb-2 text-lg">Pending Locker</h2>
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-5 text-left">Locker number</th>
                    <th className="    p-5 text-right">Duration</th>
                    <th className="  p-5 text-right">Price</th>
                    <th className="p-5 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item._id} className="border-b">
                      <td>
                        <Link
                          href={`/locker/${item.slug}`}
                          id="link"
                          className="flex items-center"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          ></Image>
                          &nbsp;
                          {item.name}
                        </Link>
                      </td>
                      <td className=" p-5 text-right">{item.duration}</td>
                      <td className="p-5 text-right">₱{item.price}</td>
                      <td className="p-5 text-right">
                        ₱{item.duration * item.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div>
                <Link href="/cart">Edit</Link>
              </div>
            </div>
          </div>
          <div>
            <div className="card  p-5">
              <h2 className="mb-2 text-lg">Order Summary</h2>
              <ul>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Total</div>
                    <div>₱{totalPrice}</div>
                  </div>
                </li>
                <li>
                  <button
                    disabled={loading}
                    onClick={placeOrderHandler}
                    className="primary-button w-full"
                  >
                    {loading ? 'Loading...' : 'Place Order'}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

PlaceOrderScreen.auth = true;
