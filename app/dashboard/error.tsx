'use client';

import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className='flex flex-col items-center justify-center py-56'>
      <h2 className='text-3xl'>حدث خطأ ما </h2>
      <Button
        className='text-lg text-primary-500'
        variant='link'
        onClick={() => reset()}
      >
        يبدو ان هناك خطا ما، يرجى إعادة المحاولة
      </Button>
    </div>
  );
}
