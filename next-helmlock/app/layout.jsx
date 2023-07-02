import Provider from '../app/components/Provider';
import { StoreProvider } from '../utils/Store';
import './globals.css';
import '../styles/Calendar.css';
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
            <main className="grow">{children}</main>
          </StoreProvider>
        </Provider>
      </body>
    </html>
  );
}
