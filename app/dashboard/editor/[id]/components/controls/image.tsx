import ImageInput from '@/app/dashboard/[id]/_components/imageInput';
import { Project } from '@/lib/supabase/schema';
import { deleteImage, uploadImageToStorage } from '@/lib/uploadImage';
import { FileImage } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ChangeEvent } from 'react';
import { useCanvas } from '../../hooks/CanvasContext';
import ControlsSectionWrapper from './wrapper';

type ImageControlsProps = {
  project: Project;
  isLoadingImage: boolean;
  setIsLoadingImage: React.Dispatch<React.SetStateAction<boolean>>;
};

const ImageControls = ({
  project,
  isLoadingImage,
  setIsLoadingImage,
}: ImageControlsProps) => {
  const router = useRouter();

  const { backgroundImageUrl, setBackgroundImageUrl } = useCanvas();

  const handleFileInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoadingImage(true);
    const imageUrl = await uploadImageToStorage(file, project.id);
    if (!imageUrl) return;

    setBackgroundImageUrl(imageUrl);

    setIsLoadingImage(false);

    router.refresh();
  };

  const handleDeleteImage = async () => {
    await deleteImage(project.id, backgroundImageUrl);
    setBackgroundImageUrl('');
    router.refresh();
  };

  return (
    <ControlsSectionWrapper
      title='إعدادات الصورة'
      icon={<FileImage className='w-4 h-4' />}
    >
      {!!backgroundImageUrl ? (
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
        <ImageInput
          id={project.id}
          setImageUrl={setBackgroundImageUrl}
          isLoading={isLoadingImage}
          setIsLoading={setIsLoadingImage}
        />
      )}
    </ControlsSectionWrapper>
  );
};

export default ImageControls;
