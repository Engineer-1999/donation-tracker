import { Button } from '@/components/ui/button';
import { downloadImage } from '@/lib/canvas';
import { extractColors } from '@/lib/canvas/colors';
import { Project } from '@/lib/supabase/schema';
import { cn } from '@/lib/utils';
import { ArrowLeftIcon, Settings } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { syncCanvasWithDatabase } from '../actions';
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

const Sidebar = ({ project, className, isLoadingImage, setIsLoadingImage }: SidebarProps) => {
  const [saving, setSaving] = useState(false);
  const [dominantColors, setDominantColors] = useState<string[]>([]);
  const [projectColor, setProjectColor] = useState<string>('#000');

  const {
    fabricRef: { current: canvas },
  } = useCanvas();

  useEffect(() => {
    const canvas = project.canvas as unknown as fabric.Canvas;
    const backgroundImage = canvas?.backgroundImage;

    if (!backgroundImage) return;

    const img = document.createElement('img');
    img.src = (backgroundImage as fabric.Object).data;
    console.log(backgroundImage);
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const colors = extractColors(img);
      if (colors) setDominantColors(colors);
    };
  }, [project.canvas, setDominantColors]);

  const onSave = async () => {
    if (!canvas) return;

    setSaving(true);
    const canvasJson = canvas?.toJSON(['data']);
    await syncCanvasWithDatabase({ canvas: canvasJson, projectId: project.id });
    setSaving(false);
  };

  const onDownload = async () => {
    if (!canvas) return;

    downloadImage(canvas);
  };

  return (
    <div
      className={cn(
        'absolute z-50 w-[280px] h-fit rounded-xl flex flex-col items-center justify-between gap-4 border border-neutral-200 bg-white overflow-auto top-[1rem] right-[1rem]',
        className,
      )}
    >
      <div className='p-2 border-b border-neutral-200 w-full flex justify-between items-center'>
        <h1 className='flex items-center gap-2'>
          <Settings className='w-[18px] h-[18px]' />
          لوحة التحكم
        </h1>
        <Link href={`/dashboard/${project.id}`}>
          <Button variant='outline' size='icon' className='flex items-center gap-2'>
            <ArrowLeftIcon className='w-4 h-4' />
          </Button>
        </Link>
      </div>
      <section className='flex flex-col w-full'>
        <ImageControls
          project={project}
          isLoadingImage={isLoadingImage}
          setIsLoadingImage={setIsLoadingImage}
        />
        <Separator />
        <ColorControls
          dominantColors={dominantColors}
          projectColor={projectColor}
          setProjectColor={setProjectColor}
        />
        <Separator />
        <ProgressBarControls projectColor={projectColor} />
        <Separator className='mb-0' />
        <div className='flex items-center gap-4 w-full p-2'>
          <Button variant='default' onClick={onSave} isLoading={saving} className='w-full'>
            حفظ
          </Button>
          <Button variant='outline' className='w-full' onClick={onDownload}>
            تحميل الصورة
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Sidebar;
