import db from '@/app/lib/db';
import Day from '@/models/Day';
import {
  differenceInHours,
  isEqual,
  isBefore,
  isAfter,
  formatISO,
  format,
} from 'date-fns';
import ClosedDay from '@/models/ClosedDay';
import { getOpeningTimes } from '@/utils/helper';
import { getJSDocReturnTag } from 'typescript';

export const getDuration = async () => {
  'use server';
  await db.connect();
  const dayOfWeek = new Date().getDay();
  const openDay = await Day.findOne({ dayOfWeek: dayOfWeek });
  await db.disconnect();
  //change the current date
  const currDate = new Date();
  const hours = currDate.getHours();
  const minutes = currDate.getMinutes();
  const year = currDate.getFullYear();
  const month = currDate.getMonth();
  const day = currDate.getDate();
  const closeTime = openDay.closeTime;
  const closeHours = closeTime.split(':')[0];
  const closeMinutes = closeTime.split(':')[1];
  const duration = Math.abs(
    differenceInHours(
      new Date(year, month, day, hours, minutes),
      new Date(year, month, day, closeHours, closeMinutes)
    )
  );
  return duration;
};

export const getDays = async () => {
  await db.connect();
  const data = await Day.find({});
  const days = data.map(db.convertDocToObj);
  await db.disconnect();
  return days;
};

export const getClosedDays = async () => {
  await db.connect();
  const data = await ClosedDay.find({});
  const closedDays = data.map(db.convertDocToObj);
  await db.disconnect();
  return closedDays;
};

export const getCurrentOpenTime = async () => {
  const dayOfWeek = new Date().getDay();
  await db.connect();
  const openDay = await Day.findOne({ dayOfWeek: dayOfWeek });
  await db.disconnect();
  const openTime = openDay.openTime;
  return openTime;
};

export const getCurrentClosingTime = async () => {
  const dayOfWeek = new Date().getDay();
  await db.connect();
  const openDay = await Day.findOne({ dayOfWeek: dayOfWeek });
  await db.disconnect();
  const closeTime = openDay.closeTime;
  return closeTime;
};

export const isDayClosed = async () => {
  const currentDate = new Date();
  await db.connect();
  const closedDays = await ClosedDay.find({});
  await db.disconnect();
  const result =
    // currentDate &&
    closedDays?.some(
      (closedDay) =>
        format(closedDay.date, 'yyyy-MM-dd') ===
        format(currentDate, 'yyyy-MM-dd')
    );
  console.log(result);
  return result;
};

export const isOpen = async () => {
  const openTime = await getCurrentOpenTime();
  const closeTime = await getCurrentClosingTime();
  const closeHours = closeTime.split(':')[0];
  const closeMinutes = closeTime.split(':')[1];
  const openHours = openTime.split(':')[0];
  const openMinutes = openTime.split(':')[1];
  //change the current date
  const currDate = new Date();
  const isCurrentDayClosed = await isDayClosed();
  const year = currDate.getFullYear();
  const month = currDate.getMonth();
  const day = currDate.getDate();
  const hours = currDate.getHours();
  const minutes = currDate.getMinutes();
  const isTimeBeforeClosingTime = isBefore(
    new Date(year, month, day, hours, minutes),
    new Date(year, month, day, closeHours, closeMinutes)
  );
  const isTimeEqualOpenTime = isEqual(
    new Date(year, month, day, hours, minutes),
    new Date(year, month, day, openHours, openMinutes)
  );
  const isTimeAfterOpenTime = isAfter(
    new Date(year, month, day, hours, minutes),
    new Date(year, month, day, openHours, openMinutes)
  );
  if (isCurrentDayClosed) {
    return false;
  } else {
    if (
      isTimeEqualOpenTime ||
      (isTimeAfterOpenTime && isTimeBeforeClosingTime)
    ) {
      return true;
    } else {
      return false;
    }
  }
};

export const convertTime = (time) => {
  const hours = time.split(':')[0];
  const minutes = time.split(':')[1];
  const AmOrPm = hours >= 12 ? 'pm' : 'am';
  const newHours = hours % 12 || 12;
  const newTime = newHours + ':' + minutes + ' ' + AmOrPm;
  return newTime;
};
