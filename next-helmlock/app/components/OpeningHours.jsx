'use client';
import React from 'react';
import { Button } from '@chakra-ui/react';
import TimeSelector from '@/app/components/TimeSelector';
import { Switch } from '@headlessui/react';
import { useSession } from 'next-auth/react';
import { formatISO, isEqual } from 'date-fns';
import { useState, useEffect, useReducer } from 'react';
import { Calendar } from 'react-calendar';
import toast, { Toaster } from 'react-hot-toast';
import { redirect, useRouter } from 'next/navigation';
import { getError } from '@/utils/error';
import axios from 'axios';
import { now } from '@/constants/config';
import { capitalize, classNames, weekdayIndexToName } from '@/utils/helper';
import data from '@/utils/data';
import Link from 'next/link';

function reducer(state, action) {
  switch (action.type) {
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
const OpeningHours = ({ days, closedDays }) => {
  const router = useRouter();
  const date = new Date();
  const [{ error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });
  const [enabled, setEnabled] = useState(false);
  const [selectedDate, setSelectedDate] = useState(date);
  // Non-null-assertions because if days are less than 7, an error is thrown previously
  const [openingHrs, setOpeningHrs] = useState([
    {
      name: 'sunday',
      openTime: days[0].openTime,
      closeTime: days[0].closeTime,
    },
    {
      name: 'monday',
      openTime: days[1].openTime,
      closeTime: days[1].closeTime,
    },
    {
      name: 'tuesday',
      openTime: days[2].openTime,
      closeTime: days[2].closeTime,
    },
    {
      name: 'wednesday',
      openTime: days[3].openTime,
      closeTime: days[3].closeTime,
    },
    {
      name: 'thursday',
      openTime: days[4].openTime,
      closeTime: days[4].closeTime,
    },
    {
      name: 'friday',
      openTime: days[5].openTime,
      closeTime: days[5].closeTime,
    },
    {
      name: 'saturday',
      openTime: days[6].openTime,
      closeTime: days[6].closeTime,
    },
  ]);
  const saveOpeningHrs = async (days) => {
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(`/api/admin/opening`, {
        days,
      });
      dispatch({ type: 'UPDATE_SUCCESS' });
      toast.success('Opening hours saved');
      router.refresh();
    } catch (err) {
      dispatch({ type: 'UPDATE_FAIL', payload: getError(err) });
      toast.error(getError(err));
    }
  };

  const openDay = async (selectedDate) => {
    try {
      console.log('clientDate delete');
      console.log(selectedDate);
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.delete('/api/admin/opening', {
        data: { date: selectedDate },
      });
      dispatch({ type: 'UPDATE_SUCCESS' });
      toast.success('Opening hours saved');
      router.refresh();
    } catch (err) {
      dispatch({ type: 'UPDATE_FAIL', payload: getError(err) });
      toast.error(getError(err));
    }
  };

  const closeDay = async (selectedDate) => {
    try {
      console.log('clientDate');
      console.log(selectedDate);
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.post('/api/admin/opening', {
        date: selectedDate,
      });
      dispatch({ type: 'UPDATE_SUCCESS' });
      toast.success('Opening hours saved');
      router.refresh();
    } catch (err) {
      dispatch({ type: 'UPDATE_FAIL', payload: getError(err) });
      toast.error(getError(err));
    }
  };

  const dayIsClosed =
    selectedDate &&
    closedDays?.some(
      (closedDay) => formatISO(closedDay.date) === formatISO(selectedDate)
    );
  // Curried for easier usage
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
    <div>
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
      {error ? (
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
                    id: days[days.findIndex((d) => d.name === day.name)]._id,
                  }));
                  // console.log(withId);
                  saveOpeningHrs(withId);
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
                    (closedDay) => formatISO(closedDay.date) === formatISO(date)
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
    </div>
  );
};

export default OpeningHours;
