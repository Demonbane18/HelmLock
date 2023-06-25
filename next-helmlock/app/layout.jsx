import Provider from '../app/components/Provider';
import { StoreProvider } from '../utils/Store';
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Helmlock',
  description: 'Helmet rental locker web app',
  icons: [
    {
      icon: '/favicon.ico',
    },
    //   {
    //     rel: 'icon',
    //     type: 'image/png',
    //     sizes: '32x32',
    //     url: '/favicon/favicon-32x32.png',
    //   },
    //   {
    //     rel: 'icon',
    //     type: 'image/ico',
    //     sizes: '32x32',
    //     url: '/favicon.ico',
    //   },
    //   {
    //     rel: 'icon',
    //     type: 'image/png',
    //     sizes: '16x16',
    //     url: '/favicon/favicon-16x16.png',
    //   },
    //   {
    //     rel: 'apple-touch-icon',
    //     sizes: '180x180',
    //     url: '/favicon/apple-touch-icon.png',
    //   },
    //   {
    //     rel: 'icon',
    //     type: 'image/png',
    //     sizes: '32x32',
    //     url: '/favicon/android-chrome-192x192.png',
    //   },
    //   {
    //     rel: 'icon',
    //     type: 'image/png',
    //     sizes: '32x32',
    //     url: '/favicon/android-chrome-512x512.png',
    //   },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.className} h-full scroll-smooth antialiased`}
    >
      <body className="flex h-full flex-col">
        <Provider>
          <StoreProvider>
            <main className="grow">{children}</main>
          </StoreProvider>
        </Provider>
      </body>
    </html>
  );
}
