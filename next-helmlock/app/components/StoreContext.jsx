'use client';
import React, { useContext } from 'react';
import { Store } from '../../utils/Store';
import axios from 'axios';
import { toast } from 'react-toastify';
import LockerItem from './Lockeritem';

const StoreContext = ({ lockers }) => {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const addToCartHandler = async (locker) => {
    const existItem = cart.cartItems.find((x) => x.slug === locker.slug);
    const quantity = existItem ? existItem.quantity : 1;
    const { data } = await axios.get(`/api/lockers/${locker._id}`);
    if (data.locker?.status === 'occupied') {
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
