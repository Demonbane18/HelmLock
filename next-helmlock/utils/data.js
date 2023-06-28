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
      duration: 5,
      status: 'occupied',
      price: 10,
      image: '/images/locked.jpg',
    },
    {
      name: 'Locker 2',
      slug: 'locker-2',
      duration: '',
      status: 'vacant',
      price: 10,
      image: '/images/unlocked.jpg',
    },
    {
      name: 'Locker 3',
      slug: 'locker-3',
      duration: '',
      status: 'vacant',
      price: 10,
      image: '/images/unlocked.jpg',
    },
    {
      name: 'Locker 4',
      slug: 'locker-4',
      duration: '',
      status: 'vacant',
      price: 10,
      image: '/images/unlocked.jpg',
    },
    {
      name: 'Locker 5',
      slug: 'locker-5',
      duration: '',
      status: 'vacant',
      price: 10,
      image: '/images/unlocked.jpg',
    },
    {
      name: 'Locker 6',
      slug: 'locker-6',
      duration: '',
      status: 'vacant',
      price: 10,
      image: '/images/unlocked.jpg',
    },
  ],
};

export default data;
