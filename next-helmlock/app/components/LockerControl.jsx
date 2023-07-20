'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
import { changeStatus } from '../lib/mqtt';
// import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const LockerControl = ({ locker, orderuser, orderid }) => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect(`/signin?callbackUrl=/locker/${orderid}`);
    },
  });
  // const supabase = createClientComponentClient();
  const [lockerButton, setLockerButton] = useState('close');
  const userid = session?.user?._id;
  const lockerHandler = async () => {
    if (lockerButton === 'close') {
      setLockerButton('open');
    } else {
      setLockerButton('close');
    }
    changeStatus(lockerButton, locker.lockerNumber);
    console.log(locker.lockerNumber);
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
                className={` w-full cursor-pointer' font-bold ${
                  lockerButton === 'open' ? 'unlock-button' : 'lock-button'
                }`}
                onClick={lockerHandler}
              >
                {lockerButton === 'open' ? 'Open' : 'Close'}
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
