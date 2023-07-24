'use client';
import React, { useContext } from 'react';
import { Store } from '../../utils/Store';
import { toast } from 'react-toastify';
import LockerItem from './Lockeritem';
import getLockerById from '@/app/_actions/getLockerById';
import Cookies from 'js-cookie';
import TypewriterComponent from 'typewriter-effect';

// async function getLockerById(id) {
//   try {
//     // const res = await axios.get(`http://localhost:3000/api/lockers/${id}`);
//     const res = await fetch(`http://localhost:3000/api/lockers/${id}`, {
//       cache: 'no-store',
//       // method: 'GET',
//       // headers: {
//       //   'Content-type': 'application/json',
//       // },
//     });

//     if (!res.ok) {
//       throw new Error('Failed to fetch locker');
//     }

//     return res.json();
//   } catch (error) {
//     console.log('Error loading locker: ', error);
//   }
// }

const StoreContext = ({
  lockers,
  isOpen,
  openTime,
  closeTime,
  isDayClosed,
}) => {
  const orderPending = Cookies.get('orderPending');
  console.log(orderPending);
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const addToCartHandler = async (locker) => {
    console.log('lockerid');
    console.log(locker._id);
    const existItem = cart.cartItems.find((x) => x.slug === locker.slug);
    const quantity = existItem ? existItem.quantity : 1;
    // const { data } = await axios.get(
    //   `http://localhost:3000/api/lockers/${locker._id}`
    // );
    // const { data } = getLockerById(locker._id);
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
        {lockers
          ? lockers.map((locker) => (
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
