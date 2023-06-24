'use client';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Layout({ title, children }) {
  const { data: session, status } = useSession();
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
            <Link id="link" href="/" className="text-lg font-bold">
              helmlock
            </Link>
            <div>
              {status === 'loading' ? (
                'Loading'
              ) : session?.user ? (
                session.user.name
              ) : (
                <Link href="/signin" className="p-2">
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
