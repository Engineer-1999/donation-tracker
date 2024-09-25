'use client';

import { Button } from '@/components/ui/button';
import { FullscreenIcon, MinimizeIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

type ControlsProps = {
  containerRef: React.RefObject<HTMLDivElement>;
};

const Controls: React.FC<ControlsProps> = ({ containerRef }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
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

  return (
    <Button
      variant='ghost'
      size='icon'
      onClick={toggleFullScreen}
      className='absolute top-4 right-4 bg-white bg-opacity-50 hover:bg-opacity-75 z-10'
    >
      {isFullScreen ? <MinimizeIcon className='h-6 w-6' /> : <FullscreenIcon className='h-6 w-6' />}
    </Button>
  );
};

export default Controls;
