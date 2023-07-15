'use client';

import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useReducer } from 'react';
import Layout from '@/app/components/Layout';
import { getError } from '@/utils/error';
import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
export const revalidate = 60;

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, lockers: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreate: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false };
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true };
    case 'DELETE_SUCCESS':
      return { ...state, loadingDelete: false, successDelete: true };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      state;
  }
}
export default function AdminLockersScreen() {
  const router = useRouter();

  const [
    { loading, error, lockers, loadingCreate, successDelete, loadingDelete },
    dispatch,
  ] = useReducer(reducer, {
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

  const createHandler = async () => {
    if (!window.confirm('Are you sure?')) {
      return;
    }
    try {
      dispatch({ type: 'CREATE_REQUEST' });
      const { data } = await axios.post(`/api/admin/lockers`);
      dispatch({ type: 'CREATE_SUCCESS' });
      toast.success('Locker created successfully');
      router.push(`/admin/locker/${data.locker._id}`);
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
      toast.error(getError(err));
    }
  };
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

    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [successDelete]);

  const deleteHandler = async (lockerId) => {
    if (!window.confirm('Are you sure?')) {
      return;
    }
    try {
      dispatch({ type: 'DELETE_REQUEST' });
      await axios.delete(`/api/admin/lockers/${lockerId}`);
      dispatch({ type: 'DELETE_SUCCESS' });
      toast.success('Locker deleted successfully');
    } catch (err) {
      dispatch({ type: 'DELETE_FAIL' });
      toast.error(getError(err));
    }
  };
  return (
    <Layout title="Admin Lockers">
      <div className="grid md:grid-cols-4 md:gap-5">
        <div>
          <ul>
            <li>
              <Link href="/admin">Dashboard</Link>
            </li>
            <Link href="/admin/opening">Opening Hours</Link>
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
          <div className="flex justify-between">
            <h1 className="mb-4 text-xl">Lockers</h1>
            {loadingDelete && <div>Deleting item...</div>}
            <button
              disabled={loadingCreate}
              onClick={createHandler}
              className="primary-button"
            >
              {loadingCreate ? 'Loading' : 'Create'}
            </button>
          </div>
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
                    <th className="p-5 text-left">LOCKER NO.</th>
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
                      <td className=" p-5 ">{locker.lockerNumber}</td>
                      <td className=" p-5 ">₱{locker.price}</td>
                      <td className=" p-5 ">{locker.status}</td>
                      <td className=" p-5 ">
                        <Link
                          href={`/admin/locker/${locker._id}`}
                          type="button"
                          className="default-button"
                        >
                          Edit
                        </Link>
                        &nbsp;
                        <button
                          onClick={() => deleteHandler(locker._id)}
                          className="default-button"
                          type="button"
                        >
                          Delete
                        </button>
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
