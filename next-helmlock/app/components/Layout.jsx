'use client';
import { signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import Cookies from 'js-cookie';
import React, { useContext, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { Menu } from '@headlessui/react';
import 'react-toastify/dist/ReactToastify.css';
import { Store } from '../../utils/Store';
import DropdownLink from './DropdownLink';
import { useRouter } from 'next/navigation';
import SearchIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon';

export default function Layout({ title, children }) {
  const { data: session, status } = useSession();
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [rentedLocker, setRentedLocker] = useState(null);

  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
  }, [cart.cartItems]);

  useEffect(() => {
    const orderPending = Cookies.get('orderPending');
    setRentedLocker(orderPending);
  }, []);

  const logoutClickHandler = () => {
    Cookies.remove('cart');
    dispatch({ type: 'CART_RESET' });
    signOut({ callbackUrl: '/signin' });
  };
  return (
    <>
      <Head>
        <title>{title ? title + ' - Helmlock' : 'Helmlock'}</title>
        <meta name="description" content="Locker rental app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ToastContainer position="bottom-center" limit={1} />

      <div className="flex min-h-screen flex-col justify-between ">
        <header>
          <nav className="flex h-12 items-center px-4 justify-between shadow-md">
            <Link
              id="link"
              href="/"
              className="text-lg font-bold cursor-pointer"
            >
              helmlock
            </Link>
            <div className="flex items-center z-10">
              {rentedLocker ? (
                <Link
                  href={`/rented-locker/${rentedLocker ? rentedLocker : ''}`}
                  className="p-2"
                >
                  Locker
                </Link>
              ) : (
                <Link href="/cart" className="p-2">
                  Cart
                  {cartItemsCount > 0 && (
                    <span className="ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>
              )}
              {status === 'loading' ? (
                'Loading'
              ) : session?.user ? (
                <Menu as="div" className="relative inline-block">
                  <Menu.Button className="text-blue-600 cursor-pointer">
                    {session.user.name}
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 w-56 origin-top-right bg-white  shadow-lg ">
                    <Menu.Item>
                      <DropdownLink
                        className="dropdown-link cursor-pointer"
                        href="/account"
                      >
                        Profile
                      </DropdownLink>
                    </Menu.Item>
                    <Menu.Item>
                      <DropdownLink
                        className="dropdown-link cursor-pointer"
                        href="/order-history"
                      >
                        Order History
                      </DropdownLink>
                    </Menu.Item>
                    {session.user.isAdmin && (
                      <Menu.Item>
                        <DropdownLink className="dropdown-link" href="/admin">
                          Admin Dashboard
                        </DropdownLink>
                      </Menu.Item>
                    )}
                    <Menu.Item>
                      <a
                        className="dropdown-link cursor-pointer"
                        href="#"
                        onClick={logoutClickHandler}
                      >
                        Logout
                      </a>
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              ) : (
                <Link href="/signin" className="p-2 cursor-pointer">
                  Sign In
                </Link>
              )}
            </div>
          </nav>
        </header>
        <main className="container m-auto mt-4 px-4">{children}</main>
        <footer className="flex h-10 justify-center items-center shadow-inner">
          <p>Copyright © 2023 Helmlock</p>
        </footer>
      </div>
    </>
  );
}
