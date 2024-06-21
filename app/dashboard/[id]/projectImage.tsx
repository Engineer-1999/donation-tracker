'use client';

import { Button } from '@/components/ui/button';
import { supabaseClient } from '@/utils/supabase/client';
import { CloudUploadIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { ChangeEvent, RefObject, useRef, useState } from 'react';
import ChangeImageButton from './changeImageButton';
import { STORAGE_URL } from '@/utils/supabase/constants';

type ProjectImageProps = {
  name: string;
  image_url: string;
  id: string;
};

const ProjectImage = ({ id, name, image_url }: ProjectImageProps) => {
  const [imageUrl, setImageUrl] = useState<string>(image_url);
  const [isLoading, setIsLoading] = useState(false);

  const hasAnImage = !!image_url || !!imageUrl;

  return (
    <section className=''>
      <h4 className='font-semibold text-gray-800 mb-3 flex items-center justify-between'>
        صورة الإعلان:
        {hasAnImage && (
          <ChangeImageButton
            id={id}
            setImageUrl={setImageUrl}
            setIsLoading={setIsLoading}
          />
        )}
      </h4>
      {hasAnImage ? (
        <div className='p-2 bg-gray-100 rounded-lg flex items-center justify-center'>
          <div className='relative w-fit h-fit'>
            <Image
              src={imageUrl}
              alt={name}
              width={200}
              height={200}
              className='rounded-lg'
            />
            {/* overlay */}
            <div
              className='absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300'
              style={{ opacity: isLoading ? 1 : 0 }}
            />
            <div
              className='absolute inset-0 z-10 flex items-center justify-center'
              style={{ opacity: isLoading ? 1 : 0 }}
            >
              <Loader2 className='text-white animate-spin w-7 h-7' />
            </div>
          </div>
        </div>
      ) : (
        <FileInput
          id={id}
          setImageUrl={setImageUrl}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      )}
    </section>
  );
};

const FileInput = ({
  id,
  setImageUrl,
  isLoading,
  setIsLoading,
}: {
  id: string;
  setImageUrl: (url: string) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}) => {
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

export default ProjectImage;
