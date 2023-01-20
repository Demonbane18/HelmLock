import bcrypt from 'bcryptjs';
const data = {
  users: [
    {
      name: 'John',
      email: 'admin@example.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: true,
    },
    {
      name: 'Jane',
      email: 'user@example.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: false,
    },
  ],
  lockers: [
    {
      name: 'Locker 1',
      slug: 'locker-1',
      time_elapsed: 5,

      status: 'occupied',
      price: 10,
      image: '/images/locked.jpg',
    },
    {
      name: 'Locker 2',
      slug: 'locker-2',
      time_elapsed: '',
      status: 'vacant',
      price: 10,
      image: '/images/unlocked.jpg',
    },
    {
      name: 'Locker 3',
      slug: 'locker-3',
      time_elapsed: '',
      status: 'vacant',
      price: 10,
      image: '/images/unlocked.jpg',
    },
  ],
};

export default data;
