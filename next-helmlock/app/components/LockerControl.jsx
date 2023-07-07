'use client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';

const LockerControl = ({ locker, orderuser, orderid }) => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect(`/signin?callbackUrl=/locker/${orderid}`);
    },
  });

  const userid = session?.user?._id;
  const lockerHandler = async () => {
    return;
  };

  return (
    <div>
      {userid === orderuser ? (
        <div className="grid md:grid-cols-4 md:gap-3">
          <div className="md:col-span-2">
            <Image
              src={locker.image}
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
                <h1 className="text-lg font-bold">{locker.name}</h1>
              </div>
              <button
                className="primary-button w-full cursor-pointer"
                onClick={lockerHandler}
              >
                Open
              </button>
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
