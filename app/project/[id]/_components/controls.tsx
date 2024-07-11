'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FullscreenIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

type ControlsProps = {
  className?: string;
};

const Controls = ({ className }: ControlsProps) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message}`,
        );
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  if (isFullScreen) {
    return null;
  }

  return (
    <div
      className={cn(
        'absolute top-4 right-4 flex items-center gap-2 flex-col',
        className,
      )}
    >
      <Button variant='default' size='icon' onClick={toggleFullScreen}>
        <FullscreenIcon className='h-6 w-6' />
      </Button>
    </div>
  );
};

export default Controls;
