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
import { isAfter, differenceInHours } from 'date-fns';
import Cookies from 'js-cookie';

const style = { layout: 'vertical', height: 40 };

// import { checkPenalty } from '../lib/time';
function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
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
  endTime,
  isEnded,
  isPenaltyPaid,
  lockerPrice,
}) => {
  const { data: session, update } = useSession({
    required: true,
    onUnauthenticated() {
      redirect(`/signin?callbackUrl=/locker/${orderid}`);
    },
  });
  const email = session?.user?.email;
  const lockerid = locker._id;
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const [
    { loading, error, loadingUpdate, order, successPay, loadingPay },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
  });
  const [isPenalty, setIsPenalty] = useState(false);
  const [penaltyPrice, setPenaltyPrice] = useState(lockerPrice);
  const [lockerButton, setLockerButton] = useState(lockerStatus);
  const [alarmStatuss, setAlarmStatuss] = useState(alarmStatus);
  const [isLockerEnded, setisLockerEnded] = useState(isEnded);
  const supabase = createClientComponentClient();
  const router = useRouter();
  // console.log(lockerStatus);
  const userid = session?.user?._id;
  const checkPenalty = (endTime) => {
    const currDate = new Date();
    const year = currDate.getFullYear();
    const month = currDate.getMonth();
    const day = currDate.getDate();
    const hours = currDate.getHours();
    const minutes = currDate.getMinutes();
    const seconds = currDate.getSeconds();
    // eslint-disable-next-line no-unused-vars
    const [time, modifier] = endTime.split(' ');
    let [endHours, endMinutes, endSeconds] = time.split(':');
    if (endHours === '12') {
      endHours = '00';
    }
    if (modifier === 'PM') {
      endHours = parseInt(endHours, 10) + 12;
    }
    const isTimeAfterEndTime = isAfter(
      new Date(year, month, day, hours, minutes, seconds),
      new Date(year, month, day, endHours, endMinutes, endSeconds)
    );
    console.log(`${hours} : ${minutes} `);
    console.log(`${endHours} : ${endMinutes} `);
    console.log(isTimeAfterEndTime);
    return isTimeAfterEndTime;
  };

  const getPenaltyDuration = (endTime) => {
    //change the current date
    const currDate = new Date();
    const hours = currDate.getHours();
    const minutes = currDate.getMinutes();
    const seconds = currDate.getSeconds();
    const year = currDate.getFullYear();
    const month = currDate.getMonth();
    const day = currDate.getDate();
    const [time, modifier] = endTime.split(' ');
    let [endHours, endMinutes, endSeconds] = time.split(':');
    if (endHours === '12') {
      endHours = '00';
    }
    if (modifier === 'PM') {
      endHours = parseInt(endHours, 10) + 12;
    }
    const duration = Math.abs(
      differenceInHours(
        new Date(year, month, day, hours, minutes, seconds),
        new Date(year, month, day, endHours, endMinutes, endSeconds)
      )
    );
    return duration;
  };
  //clear order
  async function updateSession() {
    Cookies.remove('orderPending' + userid);
  }

  useEffect(() => {
    const penalty = checkPenalty(endTime);
    console.log(penalty);
    setIsPenalty(penalty);
    if (penalty) {
      const penaltyDuration = getPenaltyDuration(endTime);
      const totalPenaltyPrice = Math.round(lockerPrice * penaltyDuration);
      setPenaltyPrice(totalPenaltyPrice);
    }
    setAlarmStatuss(alarmStatuss);
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/${orderid}`);
        const { order } = data;
        dispatch({ type: 'FETCH_SUCCESS', payload: order });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    if (!order._id || successPay || (order._id && order._id !== orderid)) {
      fetchOrder();
      if (successPay) {
        console.log('Success');
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
  }, [alarmStatuss, order, orderid, paypalDispatch, successPay, endTime]);
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
          // console.log(payload);
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

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { currency_code: 'PHP', value: penaltyPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: 'PAY_REQUEST' });
        const { data } = await axios.put(`/api/penalty/${order._id}`, {
          details,
          penaltyPrice,
        });
        dispatch({ type: 'PAY_SUCCESS', payload: data });
        toast.success('Penalty is paid successfully');
        router.refresh();
      } catch (err) {
        dispatch({ type: 'PAY_FAIL', payload: getError(err) });
        toast.error(getError(err));
      }
    });
  }
  function onError(err) {
    toast.error(getError(err));
  }
  const lockerHandler = async () => {
    try {
      if (lockerButton === 'open') {
        //check if locker is really closed
        if (alarmStatuss === 'open') {
          toast.warning(
            'Locker door is open! Please make sure the locker door is closed before locking it.'
          );
          return;
        } else {
          if (!window.confirm('Are you sure you want to close the locker?')) {
            return;
          }
        }
      } else {
        if (
          !window.confirm(
            'Are you sure you want to open and check out your locker?'
          )
        ) {
          return;
        }
      }
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(`/api/servo/${locker.lockerNumber}`, {
        orderid: order._id,
        lockerid,
      });
      dispatch({ type: 'UPDATE_SUCCESS' });
      if (lockerButton === 'close') {
        toast.success(
          'Locker is checked out successfully. Please retrieve your helmet.'
        );
        setLockerButton('open');
        setisLockerEnded(true);
        updateAlarmStatus(locker.lockerNumber, 'open');
        updateRenterEmail(locker.lockerNumber, null);
        updateSession();
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
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="alert-error">{error}</div>
      ) : userid === orderuser ? (
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
                <h1 className="text-xl font-bold ">{locker.name}</h1>
              </div>

              <div className="mb-2 flex justify-between">
                <div className="text-lg font-bold">
                  End Time:{' '}
                  <p className="inline-block font-semibold text-purple-500">
                    {endTime}
                  </p>
                </div>
              </div>
              <div className="mb-2 flex justify-between">
                <div className="text-lg font-bold">
                  Locker Status:{' '}
                  <p
                    className={
                      lockerButton === 'close'
                        ? 'inline-block font-semibold text-green-500'
                        : 'inline-block font-semibold text-orange-600'
                    }
                  >
                    {lockerButton}
                  </p>
                </div>
              </div>
              <div className="mb-2 flex justify-between">
                <div className="text-lg font-bold">
                  Alarm Status:{' '}
                  <p
                    className={
                      alarmStatuss === 'close'
                        ? 'inline-block font-semibold text-green-500'
                        : 'inline-block font-semibold text-orange-600'
                    }
                  >
                    {alarmStatuss}
                  </p>
                </div>
              </div>
              {isLockerEnded && (
                <div>
                  This locker's duration already ended. Please{' '}
                  <Link href="/">Rent a new Locker</Link> <div> </div>
                </div>
              )}
              {((!isLockerEnded && !isPenalty) ||
                (isPenaltyPaid && !isLockerEnded)) && (
                <button
                  className={` w-full cursor-pointer' font-bold ${
                    lockerButton === 'open' ? 'lock-button' : 'unlock-button'
                  }`}
                  onClick={lockerHandler}
                  disabled={
                    (isPenalty && !isPenaltyPaid) === true ? true : false
                  }
                >
                  {lockerButton === 'open' ? 'Close' : 'Checkout'}
                </button>
              )}

              {isPenalty && !isPenaltyPaid && (
                <div>
                  {isPending ? (
                    <div>Loading...</div>
                  ) : (
                    <div className="w-full md:w-auto">
                      <PayPalButtons
                        style={style}
                        forceReRender={[style]}
                        fundingSource={'paypal'}
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={onError}
                      ></PayPalButtons>
                      <div className=" m-2 text-small text-bold text-red-500">
                        You've exceeded the locker's duration time! Please pay
                        the penalty price of ₱{penaltyPrice} to check out
                      </div>
                    </div>
                  )}
                  {loadingPay && <div>Loading...</div>}
                </div>
              )}
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
