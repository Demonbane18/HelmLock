'use client';
import React, { useContext } from 'react';
import { Store } from '../../utils/Store';
import axios from 'axios';
import { toast } from 'react-toastify';
import LockerItem from './Lockeritem';
import getLockerById from '../actions/getLockerById';

const StoreContext = ({ lockers }) => {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const addToCartHandler = async (locker) => {
    console.log('lockerid');
    console.log(locker._id);
    const existItem = cart.cartItems.find((x) => x.slug === locker.slug);
    const quantity = existItem ? existItem.quantity : 1;
    const data = JSON.parse(JSON.stringify(await getLockerById(locker._id)));
    console.log('locker data');
    console.log(data.status);
    if (data.status === 'occupied') {
      return toast.error('Sorry. Locker is occupied');
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
