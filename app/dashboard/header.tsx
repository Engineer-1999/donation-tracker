'use client';

import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { generateFallbackImage } from '@/lib/utils';
import { useClerk, useUser } from '@clerk/nextjs';

const Header = () => {
  const { signOut } = useClerk();
  const { user } = useUser();

  const fullName = user?.firstName + ' ' + user?.lastName;

  return (
    <header className='border-b border-gray-200'>
      <div className='container flex items-center justify-between px-8 py-4'>
        <div className='flex items-center gap-2'>
          <Avatar
            src={user?.hasImage ? user?.imageUrl : ''}
            fallback={generateFallbackImage(
              user?.firstName ?? '',
              user?.lastName ?? '',
            )}
          />
          <h3 className='font-semibold text-gray-900 ml-4'>{fullName}</h3>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            variant='destructive'
            size='sm'
            onClick={() => signOut({ redirectUrl: '/' })}
          >
            تسجيل الخروج
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
