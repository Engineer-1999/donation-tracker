'use client';

import { Avatar } from '@/components/ui/avatar';
import Logo from '@/components/ui/logo';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarShortcut,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { generateFallbackImage } from '@/lib/utils';
import { useClerk, useUser } from '@clerk/nextjs';
import { LogOutIcon } from 'lucide-react';
import Link from 'next/link';

const Header = () => {
  const { signOut } = useClerk();
  const { user } = useUser();

  const fullName = user?.firstName + ' ' + user?.lastName;

  return (
    <header className='border-b border-gray-200'>
      <div className='container flex items-center justify-between pl-5 pr-6 py-4'>
        <Link href='/dashboard'>
          <Logo className='h-6 w-auto text-primary-900 hover:text-primary-800 transition-colors duration-200' />
        </Link>

        <Menubar>
          <MenubarMenu>
            <MenubarTrigger className='flex items-center gap-2'>
              <Avatar
                src={user?.hasImage ? user?.imageUrl : ''}
                fallback={generateFallbackImage(
                  user?.firstName ?? '',
                  user?.lastName ?? '',
                )}
              />
              <h3 className='font-semibold text-gray-900'>
                {fullName.includes('undefined') ? 'جاري التحميل...' : fullName}
              </h3>
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem
                className='!text-red-500 font-medium hover:!bg-red-50 cursor-pointer'
                onClick={() => signOut({ redirectUrl: '/' })}
              >
                تسجيل الخروج
                <MenubarShortcut>
                  <LogOutIcon className='h-4 w-4 rotate-180 text-red-500' />
                </MenubarShortcut>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
    </header>
  );
};

export default Header;
