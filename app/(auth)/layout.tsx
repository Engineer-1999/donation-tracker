'use client';

import { useAuth } from '@clerk/nextjs';
import { useEffect } from 'react';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  // const { isSignedIn } = useAuth();

  // useEffect(() => {
  //   if (isSignedIn) {
  //     window.location.href = '/dashboard';
  //   }
  // }, [isSignedIn]);

  return (
    <main className='flex flex-col items-center justify-center h-screen bg-primary-50 px-4'>
      <section className='w-full max-w-screen-sm border border-gray-200 rounded-xl p-3 md:p-7 text-center bg-white'>
        {children}
      </section>
    </main>
  );
};

export default AuthLayout;
