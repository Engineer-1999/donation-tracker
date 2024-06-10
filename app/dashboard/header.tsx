'use client';

import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { generateFallbackImage } from '@/lib/utils';
import { useClerk, useUser } from '@clerk/nextjs';

const Header = () => {
  const { signOut } = useClerk();
  const { user } = useUser();
  console.log(user?.fullName);
  return (
    <header className='border-b border-gray-200 dark:border-gray-800'>
      <div className='container flex items-center justify-between p-5'>
        <div className='flex items-center'>
          <Avatar
            src={user?.hasImage ? user?.imageUrl : ''}
            fallback={generateFallbackImage(
              user?.firstName ?? '',
              user?.lastName ?? '',
            )}
          />
        </div>
        <Button
          variant='destructive'
          size='sm'
          onClick={() => signOut({ redirectUrl: '/' })}
        >
          تسجيل الخروج
        </Button>
      </div>
    </header>
  );
};

export default Header;
