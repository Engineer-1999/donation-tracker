import { Button } from '@/components/ui/button';
import { downloadImage } from '@/lib/canvas';
import { Project } from '@/lib/supabase/schema';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { updateCanvas } from '../actions';
import ColorControls from './controls/color';
import ImageControls from './controls/image';
import ProgressBarControls from './controls/progressBar';

type SidebarProps = {
  project: Project;
  className?: string;
  imageUrl: string;
  setImageUrl: React.Dispatch<React.SetStateAction<string>>;
  canvas: fabric.Canvas | null;
  isLoadingImage: boolean;
  setIsLoadingImage: React.Dispatch<React.SetStateAction<boolean>>;
  dominantColors: string[];
  projectColor: string;
  setProjectColor: React.Dispatch<React.SetStateAction<string>>;
  setIsColorPicking: React.Dispatch<React.SetStateAction<boolean>>;
  isColorPicking: boolean;
};

const Sidebar = ({
  canvas,
  project,
  className,
  imageUrl,
  setImageUrl,
  isLoadingImage,
  setIsLoadingImage,
  dominantColors,
  projectColor,
  setProjectColor,
  setIsColorPicking,
  isColorPicking,
}: SidebarProps) => {
  const [saving, setSaving] = useState(false);

  const onSave = async () => {
    setSaving(true);
    if (!canvas) return;
    const canvasJson = canvas?.toJSON();
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
        'w-full h-full flex flex-col items-center gap-4 border-l border-neutral-200 bg-white',
        className,
      )}
    >
      <div className='p-4 border-b border-neutral-200 w-full text-center'>
        <h1>لوحة التحكم</h1>
      </div>
      <section className='flex flex-col w-full'>
        <ImageControls
          projectId={project.id}
          setImageUrl={setImageUrl}
          imageUrl={imageUrl}
          isLoadingImage={isLoadingImage}
          setIsLoadingImage={setIsLoadingImage}
        />
        <div className='w-full h-px bg-neutral-200 my-6' />
        <ColorControls
          projectId={project.id}
          projectColor={projectColor}
          isColorPicking={isColorPicking}
          setProjectColor={setProjectColor}
          setIsColorPicking={setIsColorPicking}
          dominantColors={dominantColors}
        />
        <div className='w-full h-px bg-neutral-200 my-6' />

        <ProgressBarControls
          canvas={canvas}
          projectColor={projectColor}
          project={project}
        />
        <div className='w-full h-px bg-neutral-200 my-6' />
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
