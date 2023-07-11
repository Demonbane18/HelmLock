'use client';

import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useReducer } from 'react';
import Layout from '@/app/components/Layout';
import { getError } from '@/utils/error';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, lockers: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}
export default function AdminLockersScreen() {
  const [{ loading, error, lockers }, dispatch] = useReducer(reducer, {
    loading: true,
    lockers: [],
    error: '',
  });
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect(`/signin?callbackUrl=admin/lockers`);
    },
  });

  if (!session || (session && !session.user.isAdmin)) {
    redirect(`/signin?callbackUrl=admin/lockers`);
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/lockers`);
        const { lockers } = await data;
        dispatch({ type: 'FETCH_SUCCESS', payload: lockers });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    fetchData();
  }, []);
  return (
    <Layout title="Admin Lockers">
      <div className="grid md:grid-cols-4 md:gap-5">
        <div>
          <ul>
            <li>
              <Link href="/admin">Dashboard</Link>
            </li>
            <li>
              <Link href="/admin/orders">Orders</Link>
            </li>
            <li>
              <Link href="/admin/lockers" className="font-bold">
                Lockers
              </Link>
            </li>
            <li>
              <Link href="/admin/users">Users</Link>
            </li>
          </ul>
        </div>
        <div className="overflow-x-auto md:col-span-3">
          <h1 className="mb-4 text-xl">Lockers</h1>
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
                    <th className="p-5 text-left">NAME</th>
                    <th className="p-5 text-left">PRICE (/hr)</th>
                    <th className="p-5 text-left">STATUS</th>
                    <th className="p-5 text-left">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {lockers.map((locker) => (
                    <tr key={locker._id} className="border-b">
                      <td className=" p-5 ">{locker._id.substring(20, 24)}</td>
                      <td className=" p-5 ">{locker.name}</td>
                      <td className=" p-5 ">₱{locker.price}</td>
                      <td className=" p-5 ">{locker.status}</td>
                      <td className=" p-5 ">
                        <Link href={`/admin/locker/${locker._id}`}>Edit</Link>
                        &nbsp;
                        <button>Delete</button>
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

AdminLockersScreen.auth = {
  isAdmin: true,
  unauthorized: '/', // redirect to this url
};
