'use client';

import { supabaseClient } from '@/utils/supabase/client';
import { STORAGE_URL } from '@/utils/supabase/constants';
import { ChangeEvent } from 'react';

type ChangeImageButtonProps = {
  id: string;
  setImageUrl: (url: string) => void;
  setIsLoading: (value: boolean) => void;
};
const ChangeImageButton = ({
  id,
  setImageUrl,
  setIsLoading,
}: ChangeImageButtonProps) => {
  const handleFileInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageName = `${id}-${new Date()}`;

    setIsLoading(true);
    const { data, error } = await supabaseClient.storage
      .from('images')
      .upload(imageName, file);

    if (error) {
      console.log(error);
      return;
    }

    setImageUrl(STORAGE_URL + imageName);
    const { error: updateImageUrlError } = await supabaseClient
      .from('projects')
      .update({
        image_url: STORAGE_URL + imageName,
      })
      .match({ id });

    if (updateImageUrlError) {
      console.log(error);
      return;
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  };

  return (
    <div>
      <input
        type='file'
        id='file-input'
        className='sr-only'
        onChange={handleFileInputChange}
      />
      <label
        htmlFor='file-input'
        className='text-sm font-medium text-gray-600 underline-offset-2 hover:underline cursor-pointer'
      >
        تغيير الصورة
      </label>
    </div>
  );
};

export default ChangeImageButton;
