'use client';
import React, { useContext } from 'react';
import { Store } from '../../utils/Store';
import axios from 'axios';
import { toast } from 'react-toastify';
import LockerItem from './Lockeritem';
import getLockerById from '@/app/_actions/getLockerById';
import Cookies from 'js-cookie';

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

const StoreContext = ({ lockers }) => {
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
  );
};

export default StoreContext;
