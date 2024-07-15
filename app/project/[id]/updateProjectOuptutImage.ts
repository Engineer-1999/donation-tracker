import { renderCanvasToImage } from '@/lib/canvas';
import { supabaseClient } from '@/lib/supabase/client';
import { Project } from '@/lib/supabase/schema';
import { uploadImageToStorage } from '@/lib/uploadImage';

export const updateProjectOuptutImage = async (
  project: Project,
  canvas: any,
) => {
  if (!canvas) return;

  const image = renderCanvasToImage(canvas, 'png');

  const imageFile = await fetch(image, {
    cache: 'no-cache',
  }).then((res) => res.blob());
  console.log(imageFile);

  const imageUrl = await uploadImageToStorage(imageFile, project.id);

  const { error: updateError } = await supabaseClient
    .from('projects')
    .update({
      output_image: imageUrl,
    })
    .eq('id', project.id);

  if (updateError) {
    throw updateError;
  }

  return { imageUrl };
};
