'use client';
import Cookies from 'js-cookie';
import { useForm } from 'react-hook-form';
import CheckoutWizard from '../../components/CheckoutWizard';
import Layout from '../../components/Layout';
import { Store } from '../../../utils/Store';
import { useRouter } from 'next/navigation';
import React, { useContext, useState, useEffect } from 'react';
// import { prisma } from '../../../server/db/client';
import { currentTime, updatedTime, rDuration } from '../../../utils/helper';

export default function DurationScreen() {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { lockerDuration, cartItems } = cart;
  const [duration, setDuration] = useState(null);

  const router = useRouter();
  let StartTime = currentTime();
  let EndTime = updatedTime(duration ? duration : 1);
  let LockerDuration = rDuration(duration ? duration : 1);
  const defaultValues = {
    duration: '1',
    startTime: StartTime,
    endTime: EndTime,
  };
  const { handleSubmit, register, setValue, reset } = useForm({
    defaultValues,
  });

  useEffect(() => {
    if (cartItems) {
      setDuration(cartItems[0].duration);
    }
    setValue('duration', lockerDuration.duration);
    setValue('startTime', lockerDuration.startTime);
    setValue('endTime', lockerDuration.endTime);
  }, [setValue, lockerDuration, cartItems]);

  // console.log(duration);

  const submitHandler = ({ duration, startTime, endTime }) => {
    dispatch({
      type: 'SAVE_LOCKER_DURATION',
      payload: { duration, startTime, endTime },
    });
    Cookies.remove('cart');
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
            readOnly
            value={LockerDuration}
            {...register('duration', { required: true })}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="startTime">Start Time</label>
          <input
            type="text"
            className="w-full"
            id="startTime"
            readOnly
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
            readOnly
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
                duration: LockerDuration,
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
