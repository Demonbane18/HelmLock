'use client';
import CalendarComponent from '../../components/Calendar';
import { Day } from '@prisma/client';
import { formatISO } from 'date-fns';
import Cookies from 'js-cookie';
import { useForm } from 'react-hook-form';
import CheckoutWizard from '../../components/CheckoutWizard';
import Layout from '../../components/Layout';
import { Store } from '../../../utils/Store';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';
// import { prisma } from '../../../server/db/client';
import { currentTime, updatedTime } from '../../../utils/helper';

export default function DurationScreen() {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { lockerDuration } = cart;
  const { cartDuration } = cart.cartItems[0].duration;
  const router = useRouter();
  const { handleSubmit, register, setValue, reset } = useForm();
  useEffect(() => {
    setValue('duration', lockerDuration.duration);
    setValue('startTime', lockerDuration.startTime);
    setValue('endTime', lockerDuration.endTime);
  }, [setValue, lockerDuration]);
  var StartTime = currentTime();
  var EndTime = updatedTime(cartDuration);
  console.log(cartDuration);

  const submitHandler = ({ duration, startTime, endTime }) => {
    dispatch({
      type: 'SAVE_LOCKER_DURATION',
      payload: { duration, startTime, endTime },
    });
    Cookies.set(
      'cart',
      JSON.stringify({
        ...cart,
        lockerDuration: {
          duration,
          startTime,
          endTime,
        },
      })
    );

    router.push('/payment');
  };

  return (
    <Layout title="Locker Duration">
      <CheckoutWizard activeStep={1} />
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl">Locker Duration</h1>
        <div className="mb-4">
          <label htmlFor="duration">Hours Rented</label>
          <input
            className="w-full"
            id="duration"
            value={cartDuration}
            disabled
            {...register('duration', { required: true })}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="startTime">Start Time</label>
          <input
            type="text"
            className="w-full"
            id="startTime"
            autoFocus
            disabled
            value={StartTime}
            {...register('startTime', { required: true })}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="endTime">End Time</label>
          <input
            className="w-full"
            id="endTime"
            type="text"
            autoFocus
            disabled
            value={EndTime}
            {...register('endTime', { required: true })}
          />
        </div>
        <div className="mb-4 flex justify-between">
          <button
            className="primary-button"
            onClick={() => {
              reset((formValues) => ({
                ...formValues,
                duration: cartDuration,
                startTime: StartTime,
                endTime: EndTime,
              }));
            }}
          >
            Next
          </button>
        </div>
      </form>
    </Layout>
  );
}
