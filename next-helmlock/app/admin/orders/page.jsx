'use client';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useReducer } from 'react';
import { useSession } from 'next-auth/react';
import Layout from '@/app/components/Layout';
import { getError } from '@/utils/error';
import { redirect } from 'next/navigation';
export const revalidate = 60;

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, orders: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}

export default function AdminOrderScreen() {
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: '',
  });
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect(`/signin?callbackUrl=admin/orders`);
    },
  });

  if (!session || (session && !session.user.isAdmin)) {
    redirect(`/signin?callbackUrl=admin/orders`);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const session1 = session;
        console.log(session1);
        const { data } = await axios.get(`/api/admin/orders`, {
          params: {
            session: session1,
          },
        });
        const { orders } = await data;
        dispatch({ type: 'FETCH_SUCCESS', payload: orders });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [session]);

  return (
    <Layout title="Admin Dashboard">
      <div className="grid md:grid-cols-4 md:gap-5">
        <div>
          <ul>
            <li>
              <Link href="/admin">Dashboard</Link>
            </li>
            <Link href="/admin/opening">Opening Hours</Link>
            <li>
              <Link href="/admin/orders" className="font-bold">
                Orders
              </Link>
            </li>
            <li>
              <Link href="/admin/lockers">Lockers</Link>
            </li>
            <li>
              <Link href="/admin/users">Users</Link>
            </li>
          </ul>
        </div>
        <div className="overflow-x-auto md:col-span-3">
          <h1 className="mb-4 text-xl">Admin Orders</h1>

          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="alert-error">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-5 text-left">ID</th>
                    <th className="p-5 text-left">USER</th>
                    <th className="p-5 text-left">DATE</th>
                    <th className="p-5 text-left">TOTAL</th>
                    <th className="p-5 text-left">PAID</th>
                    <th className="p-5 text-left">PENALTY</th>
                    <th className="p-5 text-left">ENDED</th>
                    <th className="p-5 text-left">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {orders &&
                    orders.map((order) => (
                      <tr key={order._id} className="border-b">
                        <td className="p-5">{order._id.substring(20, 24)}</td>
                        <td className="p-5">
                          {order.user ? order.user.name : 'DELETED USER'}
                        </td>
                        <td className="p-5">
                          {order.createdAt.substring(0, 10)}
                        </td>
                        <td className="p-5">₱{order.totalPrice}</td>
                        <td className="p-5">
                          {order.isPaid
                            ? `${order.paidAt.substring(0, 10)}`
                            : 'not paid'}
                        </td>
                        <td className="p-5">
                          {order.isPenalty
                            ? `${penaltyPaidAt.substring(0, 10)}`
                            : 'NO'}
                        </td>
                        <td className="p-5">
                          {order.isEnded ? 'YES' : 'not ended'}
                        </td>
                        <td className="p-5">
                          <Link href={`/order/${order._id}`} passHref>
                            Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

AdminOrderScreen.auth = {
  isAdmin: true,
  unauthorized: '/', // redirect to this url
};
