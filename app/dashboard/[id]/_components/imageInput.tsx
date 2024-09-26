'use client';

import {
  updateImageUrlInProject,
  uploadImageToStorage,
} from '@/lib/uploadImage';
import { CloudUploadIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ChangeEvent } from 'react';

type ImageInputProps = {
  id: string;
  setImageUrl: (url: string) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
};

const ImageInput = ({
  id,
  setImageUrl,
  isLoading,
  setIsLoading,
}: ImageInputProps) => {
  const router = useRouter();

  const handleFileInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log(file);
    if (!file) return;

    setIsLoading(true);
    const imageUrl = await uploadImageToStorage(file, id);
    if (!imageUrl) return;

    setImageUrl(imageUrl);
    await updateImageUrlInProject(id, imageUrl);

    setIsLoading(false);

    router.refresh();
  };

  return (
    <div className='border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg w-full p-6 flex flex-col items-center justify-center space-y-3 transition-colors duration-300 hover:border-gray-400 dark:hover:border-gray-500 cursor-pointer'>
      <CloudUploadIcon className='h-9 w-9 text-gray-400 dark:text-gray-500' />
      <p className='text-gray-500 dark:text-gray-400 text-center text-sm font-medium'>
        لا توجد صورة للإعلان بعد، انقر لتحميل صورة
      </p>
      <input
        type='file'
        id='file-input'
        className='sr-only'
        onChange={handleFileInputChange}
      />
      <label
        htmlFor='file-input'
        className='inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-xs font-medium text-white shadow-sm transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200 dark:focus:ring-gray-300 dark:focus:ring-offset-gray-950 cursor-pointer'
      >
        {isLoading ? 'تحميل الصورة...' : 'تصفح الملفات'}
      </label>
    </div>
  );
};

export default ImageInput;
