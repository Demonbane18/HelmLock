/* eslint-disable no-unused-vars */
'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect, useReducer } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { changeStatus } from '../lib/mqtt';
import { redirect } from 'next/navigation';
import { getError } from '@/utils/error';
import { toast } from 'react-toastify';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { updateAlarmStatus, updateRenterEmail } from '../lib/supabaseAlarm';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
function reducer(state, action) {
  switch (action.type) {
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true, errorUpdate: '' };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false, errorUpdate: '' };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false, errorUpdate: action.payload };
    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true };
    case 'PAY_FAIL':
      return { ...state, loadingPay: false, errorPay: action.payload };
    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false, errorPay: '' };
    default:
      return state;
  }
}

const LockerControl = ({
  locker,
  orderuser,
  orderid,
  lockerStatus,
  alarmStatus,
}) => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect(`/signin?callbackUrl=/locker/${orderid}`);
    },
  });
  const email = session?.user?.email;
  console.log(email);
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const [
    { loading, error, loadingUpdate, order, successPay, loadingPay },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
  });

  const [lockerButton, setLockerButton] = useState(lockerStatus);
  const [alarmStatuss, setAlarmStatuss] = useState(alarmStatus);
  const supabase = createClientComponentClient();
  const router = useRouter();
  console.log(lockerStatus);
  const userid = session?.user?._id;
  useEffect(() => {
    setAlarmStatuss(alarmStatuss);
    if (!order._id || successPay || (order._id && order._id !== orderid)) {
      if (successPay) {
        dispatch({ type: 'PAY_RESET' });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get('/api/keys/paypal');
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': clientId.data,
            currency: 'PHP',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      loadPaypalScript();
    }
  }, [alarmStatuss, order, orderid, paypalDispatch, successPay]);
  useEffect(() => {
    const channel = supabase
      .channel('IOTHelmlock')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'alarms',
        },
        (payload) => {
          console.log(payload);
          const updatedData = payload.new;
          const newAlarmStatus = updatedData.status;
          setAlarmStatuss(newAlarmStatus);
          router.refresh();
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router]);

  const lockerHandler = async () => {
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      // await axios.put(`/api/servo/${locker.lockerNumber}`);
      dispatch({ type: 'UPDATE_SUCCESS' });
      if (lockerButton === 'close') {
        toast.success(
          'Locker is checked out successfully. Please retrieve your helmet.'
        );
        setLockerButton('open');
        updateAlarmStatus(locker.lockerNumber, 'open');
        updateRenterEmail(locker.lockerNumber, null);
      } else {
        toast.success('Locker is now closed!');
        setLockerButton('close');
        updateAlarmStatus(locker.lockerNumber, 'close');
        updateRenterEmail(locker.lockerNumber, email);
      }
      changeStatus(lockerButton, locker.lockerNumber);
    } catch (err) {
      dispatch({ type: 'UPDATE_FAIL', payload: getError(err) });
      toast.error(getError(err));
    }

    return;
  };

  return (
    <div>
      {userid === orderuser ? (
        <div className="grid md:grid-cols-4 md:gap-3">
          <div className="md:col-span-2">
            <Image
              src={
                lockerButton === 'open'
                  ? '/images/unlocked.jpg'
                  : '/images/locked.jpg'
              }
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
                <h1 className="text-lg font-bold">
                  Alarm Status: {alarmStatuss}
                </h1>
              </div>
              <button
                className={` w-full cursor-pointer' font-bold ${
                  lockerButton === 'open' ? 'lock-button' : 'unlock-button'
                }`}
                onClick={lockerHandler}
              >
                {lockerButton === 'open' ? 'Close' : 'Open'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          This is not your locker. <Link href="/">Rent a Locker</Link>
        </div>
      )}
    </div>
  );
};
export default LockerControl;
