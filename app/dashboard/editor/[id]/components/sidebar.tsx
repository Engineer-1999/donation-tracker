import { Button } from '@/components/ui/button';
import { downloadImage } from '@/lib/canvas';
import { Project } from '@/lib/supabase/schema';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { updateCanvas } from '../actions';
import { useCanvas } from '../hooks/CanvasContext';
import ColorControls from './controls/color';
import ImageControls from './controls/image';
import ProgressBarControls from './controls/progressBar';
import Separator from './separator';

type SidebarProps = {
  project: Project;
  className?: string;
  isLoadingImage: boolean;
  setIsLoadingImage: React.Dispatch<React.SetStateAction<boolean>>;
};

const Sidebar = ({
  project,
  className,
  isLoadingImage,
  setIsLoadingImage,
}: SidebarProps) => {
  const [saving, setSaving] = useState(false);

  const {
    fabricRef: { current: canvas },
  } = useCanvas();

  const onSave = async () => {
    setSaving(true);
    if (!canvas) return;
    const canvasJson = canvas?.toJSON(['data']);
    await updateCanvas(project.id, {
      canvas: canvasJson,
    });
    setSaving(false);
  };

  const onDownload = async () => {
    if (!canvas) return;

    downloadImage(canvas);
  };

  return (
    <div
      className={cn(
        'w-full h-full flex flex-col items-center gap-4 border-l border-neutral-200 bg-white overflow-auto',
        className,
      )}
    >
      <div className='p-4 border-b border-neutral-200 w-full text-center'>
        <h1>لوحة التحكم</h1>
      </div>
      <section className='flex flex-col w-full'>
        <ImageControls
          project={project}
          isLoadingImage={isLoadingImage}
          setIsLoadingImage={setIsLoadingImage}
        />
        <Separator />
        <ColorControls />
        <Separator />
        <ProgressBarControls />
        <Separator />
      </section>

      <div className='flex items-center gap-4 w-full p-2'>
        <Button
          variant='default'
          onClick={onSave}
          isLoading={saving}
          className='w-full'
        >
          حفظ
        </Button>
        <Button variant='outline' className='w-full' onClick={onDownload}>
          تحميل الصورة
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
