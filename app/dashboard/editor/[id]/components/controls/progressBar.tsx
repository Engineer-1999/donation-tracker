import { Button } from '@/components/ui/button';
import { createScalableProgressBar } from '@/lib/canvas/elements';
import { Project } from '@/lib/supabase/schema';
import { fabric } from 'fabric-pure-browser';
import { Circle, CircleDot, Spline, Square } from 'lucide-react';
import ControlsSectionWrapper from './wrapper';

type ProgressBarControlsProps = {
  canvas: fabric.Canvas | null;
  projectColor: string;
  project: Project;
};

const ProgressBarControls = ({
  canvas,
  projectColor,
  project,
}: ProgressBarControlsProps) => {
  const progressPercentage =
    (parseFloat(project.progress) / parseFloat(project.target_goal)) * 100;

  const handleSetSharpProgressBar = () => {
    if (!canvas) return;

    createScalableProgressBar(canvas, {
      shape: 'sharp',
      color: projectColor,
      progress: progressPercentage || 75,
      width: 700,
    });
  };

  const handleSetCircularProgressBar = () => {
    if (!canvas) return;

    createScalableProgressBar(canvas, {
      shape: 'circular',
      color: projectColor,
      progress: progressPercentage || 75,
      width: 700,
    });
  };

  const handleSetRoundedProgressBar = () => {
    if (!canvas) return;

    createScalableProgressBar(canvas, {
      shape: 'rounded',
      color: projectColor,
      progress: progressPercentage || 75,
      width: 700,
    });
  };

  return (
    <ControlsSectionWrapper
      title='إعدادات شريط التقدم'
      icon={<CircleDot className='w-4 h-4' />}
    >
      <div className='grid grid-cols-3 items-center gap-2'>
        <Button
          variant='outline'
          className='aspect-square w-full'
          onClick={handleSetSharpProgressBar}
        >
          <Square className='w-10 h-10' />
        </Button>
        <Button
          variant='outline'
          className='aspect-square w-full'
          onClick={handleSetCircularProgressBar}
        >
          <Circle className='w-10 h-10' />
        </Button>
        <Button
          variant='outline'
          className='aspect-square w-full'
          onClick={handleSetRoundedProgressBar}
        >
          <Spline className='w-10 h-10' />
        </Button>
      </div>
    </ControlsSectionWrapper>
  );
};

export default ProgressBarControls;
