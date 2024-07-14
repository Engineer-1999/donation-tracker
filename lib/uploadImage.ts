import { supabaseClient } from './supabase/client';
import { STORAGE_URL } from './supabase/constants';

export const uploadImageToStorage = async (file: File, id: string) => {
  const imageName = `${id}-${Date.now()}`;

  const { error, data } = await supabaseClient.storage
    .from('images')
    .upload(imageName, file);

  if (error) {
    console.log(error);
    return;
  }

  console.log(data);

  return STORAGE_URL + imageName;
};

export const updateImageUrlInProject = async (id: string, imageUrl: string) => {
  const { error } = await supabaseClient
    .from('projects')
    .update({
      image_url: imageUrl,
    })
    .match({ id });

  if (error) {
    console.log(error);
    return;
  }
};

export const deleteImageFromStorage = async (imageUrl: string) => {
  const imageName = imageUrl.split(STORAGE_URL)[1];
  const { error } = await supabaseClient.storage
    .from('images')
    .remove([imageName]);

  if (error) {
    console.log(error);
    return;
  }
};

export const deleteImage = async (id: string, imageUrl: string) => {
  const { error } = await supabaseClient
    .from('projects')
    .update({ image_url: null })
    .match({ id });

  if (error) {
    console.log(error);
    return;
  }
};
