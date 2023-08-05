/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import React from 'react';

export default function lockerItem({ locker, addToCartHandler }) {
  // console.log('lockerItem');
  // console.log(locker);
  return (
    <div className="card">
      <Link
        id="link"
        href={`/locker/${locker.slug}`}
        className="cursor-pointer"
        passHref
      >
        <img
          src={locker.image}
          alt={locker.name}
          className="rounded shadow object-cover h-64 w-full"
        />
      </Link>
      <div className="flex flex-col items-center justify-center p-5">
        <Link
          id="link"
          href={`/locker/${locker.slug}`}
          className="cursor-pointer"
          passHref
        >
          <h2 className="text-lg font-bold">{locker.name}</h2>
        </Link>
        <p
          className={
            locker.status === 'vacant'
              ? 'font-semibold text-green-400'
              : 'font-semibold text-red-400'
          }
        >
          {locker.status}
        </p>
        <p>₱{locker.price}</p>
        <button
          className="primary-button cursor-pointer"
          type="button"
          onClick={() => addToCartHandler(locker)}
        >
          Rent
        </button>
      </div>
    </div>
  );
}
