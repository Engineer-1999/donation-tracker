'use client';

import { Button } from '@/components/ui/button';
import { FullscreenIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

type FullScreenButtonProps = {
  className?: string;
};

const FullScreenButton = ({ className }: FullScreenButtonProps) => {
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
    <Button
      variant='default'
      size='icon'
      onClick={toggleFullScreen}
      className={className}
    >
      <FullscreenIcon className='h-6 w-6' />
    </Button>
  );
};

export default FullScreenButton;
