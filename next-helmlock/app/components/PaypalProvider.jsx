'use client';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

const PaypalProvider = ({ children }) => {
  return (
    <PayPalScriptProvider
      deferLoading={true}
      // options={{
      //   clientId: process.env.PAYPAL_CLIENT_ID,
      //   components: 'buttons',
      //   currency: 'PHP',
      // }}
    >
      {children}
    </PayPalScriptProvider>
  );
};

export default PaypalProvider;
