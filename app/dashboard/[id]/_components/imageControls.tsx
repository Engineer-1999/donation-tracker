'use client';

import {
  deleteImage,
  updateImageUrlInProject,
  uploadImageToStorage,
} from '@/lib/uploadImage';
import { useRouter } from 'next/navigation';
import { ChangeEvent } from 'react';

type ImageControlsProps = {
  id: string;
  setImageUrl: (url: string) => void;
  imageUrl: string;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
};
const ImageControls = ({
  id,
  setImageUrl,
  imageUrl,
  setIsLoading,
  isLoading,
}: ImageControlsProps) => {
  const router = useRouter();

  const handleFileInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const imageUrl = await uploadImageToStorage(file, id);
    if (!imageUrl) return;

    setImageUrl(imageUrl);
    await updateImageUrlInProject(id, imageUrl);

    setIsLoading(false);

    router.refresh();
  };

  const handleDeleteImage = async () => {
    await deleteImage(id, imageUrl);
    setImageUrl('');
    router.refresh();
  };

  return (
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
        {isLoading ? 'تحميل الصورة...' : 'تغيير الصورة'}
      </label>
      <button
        className='flex items-center justify-center text-sm p-2 w-full rounded-lg font-medium text-white cursor-pointer bg-red-500 hover:bg-red-600'
        onClick={handleDeleteImage}
      >
        حذف الصورة
      </button>
    </div>
  );
};

export default ImageControls;
