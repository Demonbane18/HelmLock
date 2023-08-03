import Provider from '../app/components/Provider';
import { StoreProvider } from '../utils/Store';
import PaypalProvider from './components/PaypalProvider';
import ChakrasProvider from './components/ChakrasProvider';
import './globals.css';
import '@/styles/Calendar.css';
import '@/styles/Spinner.css';
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL),
  title: 'Helmlock',
  description: 'A Helmet locker rental web app',
  openGraph: {
    title: 'Helmlock',
    description: 'A Helmet locker rental web app',
  },
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
            <ChakrasProvider>
              <PaypalProvider>
                {/* {Component.auth ? (
                <Auth adminOnly={Component.auth.adminOnly}>
                  <main className="grow">{children}</main>
                </Auth>
              ) : ( */}
                <main className="grow">{children}</main>
                {/* )} */}
              </PaypalProvider>
            </ChakrasProvider>
          </StoreProvider>
        </Provider>
      </body>
    </html>
  );
}
