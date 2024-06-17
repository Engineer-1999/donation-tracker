'use client';

import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { generateFallbackImage } from '@/lib/utils';
import { useAuth, useClerk, useUser } from '@clerk/nextjs';
import { ArrowLeft } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();

  const { signOut } = useClerk();
  const { user } = useUser();

  const isNestedRoute = pathname.split('/').length > 2;

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
        <div className='flex items-center gap-2'>
          {isNestedRoute && (
            <Button
              className='group gap-1'
              variant='ghost'
              size='sm'
              onClick={() => router.back()}
            >
              العودة
              <ArrowLeft className='h-3 w-3 group-hover:-translate-x-0.5 transition-transform duration-200' />
            </Button>
          )}
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
