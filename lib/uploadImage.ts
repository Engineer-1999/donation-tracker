import { supabaseClient } from './supabase/client';
import { STORAGE_URL } from './supabase/constants';

export const uploadImageToStorage = async (file: File | Blob, id: string) => {
  const imageName = `${id}-${Date.now()}`;

  const { error, data } = await supabaseClient.storage.from('images').upload(imageName, file);

  if (error) {
    console.log(error);
    return;
  }

  console.log(data);

  return STORAGE_URL + imageName;
};

export const deleteImageFromStorage = async (imageUrl: string) => {
  const imageName = imageUrl.split(STORAGE_URL)[1];
  const { error } = await supabaseClient.storage.from('images').remove([imageName]);

  if (error) {
    console.log(error);
    return;
  }
};

export const dataURLToBlob = (dataURL: string) => {
  const parts = dataURL.split(',');
  const contentType = parts[0].split(':')[1];
  const base64Data = parts[1];

  const byteString = atob(base64Data);
  const byteNumbers = new Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    byteNumbers[i] = byteString.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: contentType });
};
