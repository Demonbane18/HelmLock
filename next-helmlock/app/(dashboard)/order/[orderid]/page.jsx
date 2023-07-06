'use client';

import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
// import { useRouter } from 'next/navigation';
import { useEffect, useReducer } from 'react';
import Layout from '../../../components/Layout';
import { getError } from '../../../../utils/error';
import { getOrderById } from '@/app/_actions/getOrderById';
// import getOrderById from '../../../../utils/getOrdersById';
export async function generateMetadata({ params }) {
  return { title: params.orderid };
}
function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}

// const getOrder = async (id) => {
//   const data = await getOrderById(id);
//   return data;
// };
// const getOrder = async (id) => {
//   try {
//     const res = await fetch(`http://localhost:3000/api/orders/${id}`, {
//       cache: 'no-store',
//     });

//     if (!res.ok) {
//       throw new Error('Failed to fetch order');
//     }

//     return res.json();
//   } catch (error) {
//     console.log('Error loading order: ', error);
//   }
// };

function OrderScreen({ params }) {
  const orderId = params.orderid;
  // console.log(orderId);
  const [{ loading, error, order }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
  });
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        // const data = JSON.parse(JSON.stringify(await getOrderById(orderId)));
        // const data = getOrder(orderId);
        // const data = params;
        const { data } = await axios.get(
          `http://localhost:3000/api/orders/${orderId}`
        );
        const { order } = data;
        // const data = await JSON.parse(JSON.stringify(data1));
        console.log(order);
        dispatch({ type: 'FETCH_SUCCESS', payload: order });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    if (!order._id || (order._id && order._id !== orderId)) {
      fetchOrder();
    }
  }, [order, orderId]);
  const {
    lockerDuration,
    orderItems,
    paymentMethod,
    totalPrice,
    isPaid,
    isEnded,
    paidAt,
    endedAt,
  } = order;
  console.log(order);
  console.log(lockerDuration);

  return (
    <Layout title={`Order ${orderId}`}>
      <h1 className="mb-4 text-xl">{`Order ${orderId}`}</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="alert-error">{error}</div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <div className="card  p-5">
              <h2 className="mb-2 text-lg">Locker Duration</h2>
              <div>
                <p>Duration: {lockerDuration.duration} hours</p>
                <p>Start Time: {lockerDuration.startTime}</p>
                <p>End Time {lockerDuration.endTime}</p>
              </div>
              {isEnded ? (
                <div className="alert-success">Ended At {endedAt}</div>
              ) : (
                <div className="alert-error">Not ended</div>
              )}
            </div>

            <div className="card p-5">
              <h2 className="mb-2 text-lg">Payment Method</h2>
              <div>{paymentMethod}</div>
              {isPaid ? (
                <div className="alert-success">Paid at {paidAt}</div>
              ) : (
                <div className="alert-error">Not paid</div>
              )}
            </div>

            <div className="card overflow-x-auto p-5">
              <h2 className="mb-2 text-lg">Locker</h2>
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-5 text-left">Locker number</th>
                    <th className="    p-5 text-right">Duration</th>
                    <th className="  p-5 text-right">Price</th>
                    <th className="p-5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item) => (
                    <tr key={item._id} className="border-b">
                      <td>
                        <Link
                          href={`/product/${item.slug}`}
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
                      <td className="p-5 text-right">${item.price}</td>
                      <td className="p-5 text-right">
                        ${item.duration * item.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <div className="card  p-5">
              <h2 className="mb-2 text-lg">Order Summary</h2>
              <ul>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Total</div>
                    <div>${totalPrice}</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

OrderScreen.auth = true;
export default OrderScreen;
