'use client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import Layout from '../../components/Layout';
import data from '../../../utils/data';

export default function LockerScreen({ params }) {
  const { slug } = params;
  const locker = data.lockers.find((x) => x.slug === slug);
  console.log(locker);
  if (!locker) {
    return <div>Locker Not Found</div>;
  }
  return (
    <Layout title={locker.name}>
      <div className="py-2">
        <Link href="/">back to lockers</Link>
      </div>
      <div className="grid md:grid-cols-4 md:gap-3">
        <div className="md:col-span-2">
          <Image
            src={locker.image}
            alt={locker.name}
            width={640}
            height={640}
            layout="responsive"
          ></Image>
        </div>
        <div>
          <ul>
            <li>
              <h1 className="text-lg">{locker.name}</h1>
            </li>
          </ul>
        </div>
        <div>
          <div className="card p-5">
            <div className="mb-2 flex justify-between">
              <div>Price</div>
              <div>${locker.price}</div>
            </div>
            <div className="mb-2 flex justify-between">
              <div>Status</div>
              <div>{locker.status}</div>
            </div>
            <button className="primary-button w-full">Rent</button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
