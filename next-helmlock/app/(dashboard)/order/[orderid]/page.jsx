'use client';

import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useReducer } from 'react';
import Layout from '../../../components/Layout';
import { getError } from '../../../../utils/error';
import { toast } from 'react-toastify';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export const revalidate = 60;

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true };
    case 'PAY_FAIL':
      return { ...state, loadingPay: false, errorPay: action.payload };
    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false, errorPay: '' };
    default:
      state;
  }
}

function OrderScreen({ params }) {
  const orderId = params.orderid;
  const router = useRouter();
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect(`/signin?callbackUrl=/order/${orderId}`);
    },
  });
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const userid = session?.user?._id;
  async function updateSession(orderid) {
    Cookies.set('orderPending' + userid, orderid);
  }
  const [{ loading, error, order, successPay, loadingPay }, dispatch] =
    useReducer(reducer, {
      loading: true,
      order: {},
      error: '',
    });
  useEffect(() => {
    if (!isEnded && isPaid) {
      toast.warning('You will be redirected to the locker in 5 seconds', {
        autoClose: 8000,
        position: 'top-center',
      });

      const timer = setTimeout(() => {
        router.replace(`/rented-locker/${orderId}`);
      }, 8000);
      return () => clearTimeout(timer);
    }
  });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/${orderId}`);
        const { order } = data;
        dispatch({ type: 'FETCH_SUCCESS', payload: order });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    if (!order._id || successPay || (order._id && order._id !== orderId)) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: 'PAY_RESET' });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get('/api/keys/paypal');
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': clientId.data,
            currency: 'PHP',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      loadPaypalScript();
    }
  }, [order, orderId, paypalDispatch, successPay]);
  const {
    lockerDuration,
    orderItems,
    paymentMethod,
    totalPrice,
    isPaid,
    isEnded,
    paidAt,
    isPenaltyPaid,
    penaltyPaidAt,
    endedAt,
    user,
  } = order;

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { currency_code: 'PHP', value: totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: 'PAY_REQUEST' });
        const { data } = await axios.put(`/api/orders/${order._id}`, details);
        dispatch({ type: 'PAY_SUCCESS', payload: data });
        toast.success('Order is paid successfully', {
          autoClose: 3000,
        });
        updateSession(orderId);
      } catch (err) {
        dispatch({ type: 'PAY_FAIL', payload: getError(err) });
        toast.error(getError(err));
      }
    });
  }
  function onError(err) {
    toast.error(getError(err));
  }

  return (
    <Layout title={`Order ${orderId}`}>
      <h1 className="mb-4 text-xl">{`Order ${orderId}`}</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="alert-error">{error}</div>
      ) : session?.user?._id !== user ? (
        <div className="alert-error">This is not your order!</div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <div className="card  p-5">
              <h2 className="mb-2 text-lg">Locker Duration</h2>
              <div>
                <p>
                  Duration: {lockerDuration.duration} hour
                  {lockerDuration.duration !== 1 ? 's' : ''}
                </p>
                <p>Start Time: {lockerDuration.startTime}</p>
                <p>End Time {lockerDuration.endTime}</p>
              </div>
              {isEnded ? (
                <div className="alert-success">Ended At {endedAt}</div>
              ) : (
                <div className="alert-error">Not ended</div>
              )}
            </div>

            <div className="card p-5">
              <h2 className="mb-2 text-lg">Payment Method</h2>
              <div>{paymentMethod}</div>
              {isPaid ? (
                <div className="alert-success">Paid at {paidAt}</div>
              ) : (
                <div className="alert-error">Not paid</div>
              )}
              {isPenaltyPaid ? (
                <div className="alert-success">
                  Penalty Paid at {penaltyPaidAt}
                </div>
              ) : (
                <div></div>
              )}
            </div>

            <div className="card overflow-x-auto p-5">
              <h2 className="mb-2 text-lg">Locker</h2>
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-5 text-left">Locker number</th>
                    <th className="    p-5 text-right">Duration</th>
                    <th className="  p-5 text-right">Price</th>
                    <th className="p-5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item) => (
                    <tr key={item._id} className="border-b">
                      <td>
                        <Link
                          href={`/product/${item.slug}`}
                          className="flex items-center"
                          passHref
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          ></Image>
                          &nbsp;
                          {item.name}
                        </Link>
                      </td>
                      <td className=" p-5 text-right">{item.duration}</td>
                      <td className="p-5 text-right">₱{item.price}</td>
                      <td className="p-5 text-right">
                        ₱{item.duration * item.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <div className="card  p-5">
              <h2 className="mb-2 text-lg">Order Summary</h2>
              <ul>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Total</div>
                    <div>₱{totalPrice}</div>
                  </div>
                </li>
                {!isPaid && (
                  <li>
                    {isPending ? (
                      <div>Loading...</div>
                    ) : (
                      <div className="w-full object-fill">
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      </div>
                    )}
                    {loadingPay && <div>Loading...</div>}
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

OrderScreen.auth = true;
export default OrderScreen;
