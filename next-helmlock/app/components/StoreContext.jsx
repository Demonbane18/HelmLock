'use client';
import React, { useContext, useState, useEffect } from 'react';
import { Store } from '../../utils/Store';
import { toast } from 'react-toastify';
import LockerItem from './Lockeritem';
import getLockerById from '@/app/_actions/getLockerById';
import TypewriterComponent from 'typewriter-effect';
import { useSession } from 'next-auth/react';
import Cookies from 'js-cookie';

const StoreContext = ({
  lockers,
  isOpen,
  openTime,
  closeTime,
  isDayClosed,
  currDate,
}) => {
  const { data: session } = useSession();
  const userid = session?.user?._id;
  const orderPending = Cookies.get('orderPending' + userid);
  console.log(orderPending);
  const [showLockers, setShowLockers] = useState(lockers);
  useEffect(() => {
    const fetchData = () => {
      // const updatedLockers = await getLockers();
      setShowLockers(lockers);
    };
    fetchData();
  }, []);

  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const addToCartHandler = async (locker) => {
    console.log('lockerid');
    console.log(locker._id);
    const existItem = cart.cartItems.find((x) => x.slug === locker.slug);
    const quantity = existItem ? existItem.quantity : 1;
    const data = JSON.parse(JSON.stringify(await getLockerById(locker._id)));
    if (!isOpen) {
      return toast.error('Store is closed!');
    }
    if (orderPending) {
      return toast.error('You already have a rented locker!');
    }
    if (data.status === 'occupied') {
      return toast.error('Sorry. Locker is occupied');
    }
    if (cart.cartItems.length == 1) {
      return toast.error('You have a pending locker in your cart.');
    }

    dispatch({ type: 'CART_ADD_ITEM', payload: { ...locker, quantity } });

    toast.success('Locker added to the cart');
  };
  return (
    <div>
      <div className="text-transparent text-lg bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 font-bold flex justify-center">
        {isDayClosed ? (
          <TypewriterComponent
            options={{
              strings: [
                'Store is closed for the day. Please come back tomorrow.',
              ],
              autoStart: true,
              loop: true,
            }}
          />
        ) : isOpen ? (
          <TypewriterComponent
            options={{
              strings: [
                'Store is Open!',
                'Open until' + ' ' + closeTime,
                "Don't forget to checkout before your time is up or you'll have to pay penalty!",
                'Make sure to put your helmet first before you close the locker!',
              ],
              autoStart: true,
              loop: true,
            }}
            methods={{ changeDeleteSpeed: 100 }}
          />
        ) : (
          <TypewriterComponent
            options={{
              strings: [
                'Store is Closed! Please come back later.',
                'Date is' + ' ' + currDate,
                "Today's schedule:",
                'Open Time:' + ' ' + openTime,
                'Closing Time:' + ' ' + closeTime,
              ],
              autoStart: true,
              loop: true,
            }}
          />
        )}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-3">
        {showLockers
          ? showLockers.map((locker) => (
              <LockerItem
                locker={locker}
                key={locker.slug}
                addToCartHandler={addToCartHandler}
              ></LockerItem>
            ))
          : null}
      </div>
    </div>
  );
};

export default StoreContext;
