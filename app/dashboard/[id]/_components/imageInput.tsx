'use client';

import { supabaseClient } from '@/lib/supabase/client';
import { STORAGE_URL } from '@/lib/supabase/constants';
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
    if (!file) return;

    setIsLoading(true);
    const { data, error } = await supabaseClient.storage
      .from('images')
      .upload(`${id}`, file);

    if (error) {
      console.log(error);
      return;
    }

    setImageUrl(STORAGE_URL + id);
    const { error: updateImageUrlError } = await supabaseClient
      .from('projects')
      .update({
        image_url: STORAGE_URL + id,
      })
      .match({ id });

    if (updateImageUrlError) {
      console.log(error);
      return;
    }

    router.refresh();
    setIsLoading(false);
    console.log(data);
  };

  return (
    <div className='border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg w-full p-12 flex flex-col items-center justify-center space-y-4 transition-colors duration-300 hover:border-gray-400 dark:hover:border-gray-500 cursor-pointer'>
      <CloudUploadIcon className='h-12 w-12 text-gray-400 dark:text-gray-500' />
      <p className='text-gray-500 dark:text-gray-400'>
        انقر لتحديد صورة للإعلان
      </p>
      <input
        type='file'
        id='file-input'
        className='sr-only'
        onChange={handleFileInputChange}
      />
      <label
        htmlFor='file-input'
        className='inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200 dark:focus:ring-gray-300 dark:focus:ring-offset-gray-950 cursor-pointer'
      >
        {isLoading ? 'تحميل الصورة...' : 'تصفح الملفات'}
      </label>
    </div>
  );
};

export default ImageInput;
