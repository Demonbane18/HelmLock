'use client';
import React from 'react';
import { Button } from '@chakra-ui/react';
import TimeSelector from '@/app/components/TimeSelector';
import { Switch } from '@headlessui/react';
import { useSession } from 'next-auth/react';
import { formatISO } from 'date-fns';
import { useState, useEffect, useReducer } from 'react';
import { Calendar } from 'react-calendar';
import toast, { Toaster } from 'react-hot-toast';
import { redirect } from 'next/navigation';
import { getError } from '@/utils/error';
import axios from 'axios';
import { now } from '@/constants/config';
import { capitalize, classNames, weekdayIndexToName } from '@/utils/helper';
import Layout from '@/app/components/Layout';
// import getClosedDays from '@/app/_actions/getClosedDays';
import data from '@/utils/data';
import Link from 'next/link';

export const revalidate = 60;

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, days: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true, errorUpdate: '' };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false, errorUpdate: '' };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false, errorUpdate: action.payload };
    default:
      return state;
  }
}

export default function OpeningHourScreen() {
  const date = new Date();
  const [{ loading, error, loadingUpdate, days }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      days: [],
      error: '',
    }
  );
  const [enabled, setEnabled] = useState(false);
  const [selectedDate, setSelectedDate] = useState(date);

  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect(`/signin?callbackUrl=admin/opening`);
    },
  });

  if (!session || (session && !session.user.isAdmin)) {
    redirect(`/signin?callbackUrl=admin/opening`);
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/opening`);
        const { days } = data;
        dispatch({ type: 'FETCH_SUCCESS', payload: days });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    fetchData();
  }, []);

  // Non-null-assertions because if days are less than 7, an error is thrown previously
  const [openingHrs, setOpeningHrs] = useState([
    {
      name: 'sunday',
      openTime: '9:00',
      closeTime: '12:00',
      // openTime: days[0].openTime,
      // closeTime: days[0].closeTime,
    },
    {
      name: 'monday',
      openTime: '9:00',
      closeTime: '12:00',
      // openTime: days[1].openTime,
      // closeTime: days[1].closeTime,
    },
    {
      name: 'tuesday',
      openTime: '9:00',
      closeTime: '12:00',
      // openTime: days[2].openTime,
      // closeTime: days[2].closeTime,
    },
    {
      name: 'wednesday',
      openTime: '9:00',
      closeTime: '12:00',
      // openTime: days[3].openTime,
      // closeTime: days[3].closeTime,
    },
    {
      name: 'thursday',
      openTime: '9:00',
      closeTime: '12:00',
      // openTime: days[4].openTime,
      // closeTime: days[4].closeTime,
    },
    {
      name: 'friday',
      openTime: '9:00',
      closeTime: '12:00',
      // openTime: days[5].openTime,
      // closeTime: days[5].closeTime,
    },
    {
      name: 'saturday',
      openTime: '9:00',
      closeTime: '12:00',
      // openTime: days[6].openTime,
      // closeTime: days[6].closeTime,
    },
  ]);
  // tRPC
  //  const {
  //   mutate: saveOpeningHrs,
  //   isLoading
  // } = trpc.opening.changeOpeningHours.useMutation({
  //   onSuccess: () => toast.success("Opening hours saved"),
  //   onError: () => toast.error("Something went wrong")
  // })
  const openDay = async ({ selectedDate }) => {
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put('/api/admin/opening/openDay', {
        selectedDate,
      });
      dispatch({ type: 'UPDATE_SUCCESS' });
      toast.success('Opening hours saved');
      router.refresh();
    } catch (err) {
      dispatch({ type: 'UPDATE_FAIL', payload: getError(err) });
      toast.error(getError(err));
    }
  };

  const closeDay = async ({ selectedDate }) => {
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put('/api/admin/opening/closeDay', {
        selectedDate,
      });
      dispatch({ type: 'UPDATE_SUCCESS' });
      toast.success('Opening hours saved');
      router.refresh();
    } catch (err) {
      dispatch({ type: 'UPDATE_FAIL', payload: getError(err) });
      toast.error(getError(err));
    }
  };
  // const { data: closedDays, refetch } = trpc.opening.getClosedDays.useQuery()
  const closedDays = data.closedDays;
  const dayIsClosed =
    selectedDate &&
    closedDays?.some((closedDay) => closedDay.date === formatISO(selectedDate));

  console.log(dayIsClosed);
  // Curried for easier usage
  console.log(formatISO(selectedDate));
  function _changeTime(day) {
    return function (time, type) {
      const index = openingHrs.findIndex(
        (x) => x.name === weekdayIndexToName(day.dayOfWeek)
      );
      const newOpeningHrs = [...openingHrs];
      newOpeningHrs[index][type] = time;
      setOpeningHrs(newOpeningHrs);
    };
  }

  return (
    <Layout title="Set Opening Hours">
      <div className="grid md:grid-cols-4 md:gap-5">
        <div>
          <ul>
            <li>
              <Link href="/admin">Dashboard</Link>
            </li>
            <li>
              <Link href="/admin/opening" className="font-bold">
                Opening Hours
              </Link>
            </li>
            <li>
              <Link href="/admin/orders">Orders</Link>
            </li>
            <li>
              <Link href="/admin/lockers">Lockers</Link>
            </li>
            <li>
              <Link href="/admin/users">Users</Link>
            </li>
          </ul>
        </div>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="alert-error">{error}</div>
      ) : (
        <div className="mx-auto max-w-xl">
          <Toaster />
          <div className="mt-6 flex justify-center gap-6">
            <p className={`${!enabled ? 'font-medium' : ''}`}>Opening times</p>
            <Switch
              checked={enabled}
              onChange={setEnabled}
              className={classNames(
                enabled ? 'bg-indigo-600' : 'bg-gray-200',
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
              )}
            >
              <span className="sr-only">Use setting</span>
              <span
                aria-hidden="true"
                className={classNames(
                  enabled ? 'translate-x-5' : 'translate-x-0',
                  'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                )}
              />
            </Switch>
            <p className={`${enabled ? 'font-medium' : ''}`}>Opening days</p>
          </div>

          {!enabled ? (
            // Opening times options
            <div className="my-12 flex flex-col gap-8">
              {days.map((day) => {
                const changeTime = _changeTime(day);
                return (
                  <div
                    className="grid grid-cols-3 place-items-center"
                    key={day.id}
                  >
                    <h3 className="font-semibold">
                      {capitalize(weekdayIndexToName(day.dayOfWeek))}
                    </h3>
                    <div className="mx-4">
                      <TimeSelector
                        type="openTime"
                        changeTime={changeTime}
                        selected={
                          openingHrs[
                            openingHrs.findIndex(
                              (x) =>
                                x.name === weekdayIndexToName(day.dayOfWeek)
                            )
                          ]?.openTime
                        }
                      />
                    </div>

                    <div className="mx-4">
                      <TimeSelector
                        type="closeTime"
                        changeTime={changeTime}
                        selected={
                          openingHrs[
                            openingHrs.findIndex(
                              (x) =>
                                x.name === weekdayIndexToName(day.dayOfWeek)
                            )
                          ]?.closeTime
                        }
                      />
                    </div>
                  </div>
                );
              })}

              <Button
                onClick={() => {
                  const withId = openingHrs.map((day) => ({
                    ...day,
                    id: days[days.findIndex((d) => d.name === day.name)].id,
                  }));
                  console.log(withId);
                  // saveOpeningHrs(withId);
                }}
                // isLoading={isLoading}
                colorScheme="green"
                variant="solid"
              >
                Save
              </Button>
            </div>
          ) : (
            // Opening days options
            <div className="mt-6 flex flex-col items-center gap-6">
              <Calendar
                minDate={now}
                className="REACT-CALENDAR p-2"
                view="month"
                onClickDay={(date) => setSelectedDate(date)}
                tileClassName={({ date }) => {
                  return closedDays?.some(
                    (closedDay) => closedDay.date === formatISO(date)
                  )
                    ? 'closed-day'
                    : null;
                }}
              />

              <Button
                onClick={() => {
                  if (dayIsClosed) openDay({ date: selectedDate });
                  else if (selectedDate) closeDay({ date: selectedDate });
                }}
                disabled={!selectedDate}
                // isLoading={isLoading}
                colorScheme="green"
                variant="solid"
              >
                {dayIsClosed ? 'Open shop this day' : 'Close shop this day'}
              </Button>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}
