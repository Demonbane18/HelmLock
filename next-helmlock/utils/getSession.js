import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function getSession() {
  const { data: session } = getServerSession(authOptions);
  console.log(session);
  return session;
}
