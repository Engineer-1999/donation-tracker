'use client';

import { Button } from '@/components/ui/button';
import { useClerk } from '@clerk/nextjs';
import React from 'react';

const DashboardPage = () => {
  const { signOut } = useClerk();

  return (
    <div>
      <Button onClick={() => signOut({ redirectUrl: '/' })}>
        تسجيل الخروج
      </Button>
    </div>
  );
};

export default DashboardPage;
