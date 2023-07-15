import Provider from '../app/components/Provider';
import { StoreProvider } from '../utils/Store';
import PaypalProvider from './components/PaypalProvider';
import ChakrasProvider from './components/ChakrasProvider';
import './globals.css';
import '@/styles/Calendar.css';
import '@/styles/Spinner.css';
import { Inter } from 'next/font/google';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
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

// function Auth({ children, adminOnly }) {
//   const router = useRouter();
//   const { status, data: session } = useSession({
//     required: true,
//     onUnauthenticated() {
//       router.push('/unauthorized?message=login required');
//     },
//   });
//   if (status === 'loading') {
//     return <div>Loading...</div>;
//   }
//   if (adminOnly && !session.user.isAdmin) {
//     router.push('/unauthorized?message=admin login required');
//   }

//   return children;
// }

export default function RootLayout({ Component, children }) {
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
