'use client';

import { redirect } from 'next/navigation';
import { useSession} from 'next-auth/react';
import { User } from '@prisma/client';
import { timeUTCToCN } from '@/lib/timeUtils';

const Page = () => {
  const { data: session, status } = useSession();
  // console.log('session', session);
  const userInfo = session?.user as User;
  // const signOut = async () => {
  //   console.log('signOut');
  // };
  if (!session) {
    redirect('/auth/login');
  }

  if (!session.user) {
    return <div>User information is missing</div>;
  }

  return (
    <div>
      Signed in as A{userInfo.phone || 'Unknown'} <br />
      创建时间是{timeUTCToCN(userInfo.createdAt, '-')}
      <br />
      {/* <button onClick={() => signOut()}>Sign out</button> */}
    </div>
  );
};

export default Page;
