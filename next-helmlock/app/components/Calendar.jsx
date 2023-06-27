'use client';
import { Day } from '@prisma/client';
import { format, formatISO, isBefore, parse } from 'date-fns';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { now, OPENING_HOURS_INTERVAL } from '../../constants/config';
import { getOpeningTimes, roundToNearestMinutes } from '../../utils/helper';

export default function Calendar() {
  const DynamicCalendar = dynamic(() => import('react-calendar'), {
    ssr: false,
  });

  return <div>Calendar</div>;
}
