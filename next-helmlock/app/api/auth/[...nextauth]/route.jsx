import bcryptjs from 'bcryptjs';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import User from '../../../../models/User';
import db from '../../../lib/db';

export const authOptions = {
  session: {
    strategy: 'jwt',
  },
  secret: process.env.SECRET,
  callbacks: {
    async jwt({ token, user, session, trigger }) {
      // console.log('jwt callback', { token, user, session });
      if (user) {
        return {
          ...token,
          _id: user._id,
          isAdmin: user.isAdmin,
          rentedLocker: user.rentedLocker,
        };
      }
      //update rented locker
      if (trigger === 'update' && session?.rentedLocker) {
        token.rentedLocker = session.rentedLocker;
      }
      return token;
    },
    async session({ session, token, user }) {
      console.log('session callback', { token, user, session });
      return {
        ...session,
        user: {
          ...session.user,
          _id: token._id,
          isAdmin: token.isAdmin,
          rentedLocker: token.rentedLocker,
        },
      };
    },
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        await db.connect();
        const user = await User.findOne({
          email: credentials.email,
        });
        await db.disconnect();
        if (user && bcryptjs.compareSync(credentials.password, user.password)) {
          return {
            _id: user._id,
            name: user.name,
            email: user.email,
            image: 'f',
            isAdmin: user.isAdmin,
            rentedLocker: user.rentedLocker,
          };
        }
        throw new Error('Invalid email or password');
      },
    }),
  ],
  pages: {
    signIn: '/signin',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
