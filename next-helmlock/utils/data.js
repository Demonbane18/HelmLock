import bcrypt from 'bcryptjs';

const data = {
  users: [
    {
      name: 'John',
      email: 'admin@example.com',
      password: bcrypt.hashSync('123456'),
      coins: 200,
      isAdmin: true,
    },
    {
      name: 'Jane',
      email: 'user@example.com',
      coins: 100,
      password: bcrypt.hashSync('123456'),
      isAdmin: false,
    },
  ],
  lockers: [
    {
      name: 'Locker 1',
      slug: 'locker-1',
      lockerNumber: 1,
      duration: 5,
      status: 'occupied',
      price: 10,
      image: '/images/locked.jpg',
    },
    {
      name: 'Locker 2',
      slug: 'locker-2',
      lockerNumber: 2,
      duration: '',
      status: 'vacant',
      price: 10,
      image: '/images/unlocked.jpg',
    },
    {
      name: 'Locker 3',
      slug: 'locker-3',
      lockerNumber: 3,
      duration: '',
      status: 'vacant',
      price: 10,
      image: '/images/unlocked.jpg',
    },
    {
      name: 'Locker 4',
      slug: 'locker-4',
      lockerNumber: 4,
      duration: '',
      status: 'vacant',
      price: 10,
      image: '/images/unlocked.jpg',
    },
    {
      name: 'Locker 5',
      slug: 'locker-5',
      lockerNumber: 5,
      duration: '',
      status: 'vacant',
      price: 10,
      image: '/images/unlocked.jpg',
    },
    {
      name: 'Locker 6',
      slug: 'locker-6',
      lockerNumber: 6,
      duration: '',
      status: 'vacant',
      price: 10,
      image: '/images/unlocked.jpg',
    },
  ],
  days: [
    {
      name: 'sunday',
      dayOfWeek: 0,
      openTime: '9:00',
      closeTime: '16:00',
    },
    {
      name: 'monday',
      dayOfWeek: 1,
      openTime: '9:00',
      closeTime: '16:00',
    },
    {
      name: 'tuesday',
      dayOfWeek: 2,
      openTime: '9:00',
      closeTime: '16:00',
    },
    {
      name: 'wednesday',
      dayOfWeek: 3,
      openTime: '9:00',
      closeTime: '16:00',
    },
    {
      name: 'thursday',
      dayOfWeek: 4,
      openTime: '9:00',
      closeTime: '16:00',
    },
    {
      name: 'friday',
      dayOfWeek: 5,
      openTime: '9:00',
      closeTime: '16:00',
    },
    {
      name: 'saturday',
      dayOfWeek: 6,
      openTime: '9:00',
      closeTime: '16:00',
    },
  ],
  closedDays: [
    {
      date: '07/18/2023',
    },
  ],
};

export default data;
