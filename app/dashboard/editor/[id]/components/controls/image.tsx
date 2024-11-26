import { updateCanvasSize } from '@/lib/canvas';
import {
  getCanvasBackgroundImage,
  removeCanvasBackground,
  updateCanvasBackground,
} from '@/lib/canvas/canvasBackground';
import { Project } from '@/lib/supabase/schema';
import { uploadImageToStorage } from '@/lib/uploadImage';
import { fabric } from 'fabric-pure-browser';
import { CloudUploadIcon, FileImage } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { useCanvas } from '../../hooks/CanvasContext';
import ControlsSectionWrapper from './wrapper';

type ImageControlsProps = {
  project: Project;
  isLoadingImage: boolean;
  setIsLoadingImage: React.Dispatch<React.SetStateAction<boolean>>;
};

const ImageControls = ({ project, isLoadingImage, setIsLoadingImage }: ImageControlsProps) => {
  const router = useRouter();
  const {
    fabricRef: { current: canvas },
  } = useCanvas();

  const hasBackgroundImage = useMemo(
    () => !!getCanvasBackgroundImage({ canvas }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [canvas?.backgroundImage],
  );

  const handleFileInputChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (!canvas) return;

      const file = e.target.files?.[0];
      if (!file) return;

      setIsLoadingImage(true);
      try {
        const imageUrl = await uploadImageToStorage(file, project.id);
        if (!imageUrl) {
          throw new Error('Error uploading image');
        }

        fabric.Image.fromURL(
          imageUrl,
          (img) => {
            const aspectRatio = img.width! / img.height!;
            const windowHeight = window.innerHeight;
            const newHeight = Math.max(800, windowHeight * 0.8); // Adjust the multiplier as needed
            const newWidth = newHeight * aspectRatio;

            updateCanvasBackground({ canvas, imageUrl: imageUrl });
            updateCanvasSize({ canvas, width: newWidth, height: newHeight });
          },
          { crossOrigin: 'anonymous' },
        );
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error('حدث خطأ أثناء تحميل الصورة');
      } finally {
        setIsLoadingImage(false);
        router.refresh();
      }
    },
    [canvas, project.id, router, setIsLoadingImage],
  );

  const handleDeleteImage = useCallback(async () => {
    if (!canvas) return;

    try {
      removeCanvasBackground({ canvas });
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('حدث خطأ أثناء حذف الصورة');
    } finally {
      router.refresh();
    }
  }, [canvas, router]);

  return (
    <ControlsSectionWrapper title='إعدادات الصورة' icon={<FileImage className='w-4 h-4' />}>
      {hasBackgroundImage ? (
        <div className='flex items-center gap-2 w-full'>
          <div className='w-full flex items-center gap-2'>
            <input
              type='file'
              id='file-input'
              className='sr-only'
              onChange={handleFileInputChange}
            />
            <label
              htmlFor='file-input'
              className='flex items-center justify-center text-sm p-2 w-full rounded-lg font-medium text-gray-600 cursor-pointer border border-gray-300 hover:border-gray-400'
            >
              {isLoadingImage ? 'تحميل الصورة...' : 'تغيير الصورة'}
            </label>
            <button
              className='flex items-center justify-center text-sm p-2 w-full rounded-lg font-medium text-white cursor-pointer bg-red-500 hover:bg-red-600'
              onClick={handleDeleteImage}
            >
              حذف الصورة
            </button>
          </div>
        </div>
      ) : (
        <div className='border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg w-full p-6 flex flex-col items-center justify-center space-y-3 transition-colors duration-300 hover:border-gray-400 dark:hover:border-gray-500 cursor-pointer'>
          <CloudUploadIcon className='h-9 w-9 text-gray-400 dark:text-gray-500' />
          <p className='text-gray-500 dark:text-gray-400 text-center text-sm font-medium'>
            لا توجد صورة للإعلان بعد، انقر لتحميل صورة
          </p>
          <input type='file' id='file-input' className='sr-only' onChange={handleFileInputChange} />
          <label
            htmlFor='file-input'
            className='inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-xs font-medium text-white shadow-sm transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200 dark:focus:ring-gray-300 dark:focus:ring-offset-gray-950 cursor-pointer'
          >
            {isLoadingImage ? 'تحميل الصورة...' : 'تصفح الملفات'}
          </label>
        </div>
      )}
    </ControlsSectionWrapper>
  );
};

export default ImageControls;
