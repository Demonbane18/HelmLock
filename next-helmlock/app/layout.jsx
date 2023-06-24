import Provider from '../app/components/Provider';
import { StoreProvider } from '../utils/Store';
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Helmlock',
  description: 'Helmet rental locker web app',
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
