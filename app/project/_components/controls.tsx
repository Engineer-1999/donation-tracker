'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import { Project, ProjectSettings } from '@/lib/supabase/schema';
import { cn } from '@/lib/utils';
import { useAuth } from '@clerk/nextjs';
import { FullscreenIcon, SlidersHorizontal } from 'lucide-react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import ControlsSlider from './controlsSlider/controlsSlider';

type ControlsProps = {
  className?: string;
  project: Project;
  projectSettings: ProjectSettings;
  setProjectSettings: Dispatch<SetStateAction<ProjectSettings>>;
  updateProject: (projectId: string, data: any) => Promise<Project>;
};

const Controls = ({
  className,
  project,
  projectSettings,
  setProjectSettings,
  updateProject,
}: ControlsProps) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isControlsOpen, setIsControlsOpen] = useState(false);

  const { userId } = useAuth();

  const isOwner = userId === project.user_id;

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

  const handleSheetOpenChange = (open: boolean) => {
    if (!open) {
      setProjectSettings(project.settings);
    }
    setIsControlsOpen(open);
  };

  return (
    <div className={cn('flex items-center gap-2 flex-col', className)}>
      <Button variant='default' size='icon' onClick={toggleFullScreen}>
        <FullscreenIcon className='h-6 w-6' />
      </Button>
      {isOwner && (
        <Sheet open={isControlsOpen} onOpenChange={handleSheetOpenChange}>
          <SheetTrigger asChild>
            <Button variant='default' size='icon'>
              <SlidersHorizontal className='w-6 h-6' />
            </Button>
          </SheetTrigger>
          <ControlsSlider
            project={project}
            projectSettings={projectSettings}
            setProjectSettings={setProjectSettings}
            updateProject={updateProject}
            setIsControlsOpen={setIsControlsOpen}
          />
        </Sheet>
      )}
    </div>
  );
};

export default Controls;
