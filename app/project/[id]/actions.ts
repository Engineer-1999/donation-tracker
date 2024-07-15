'use server';

import { fetchProjectById } from '@/app/dashboard/[id]/actions';
import { renderCanvasToImage } from '@/lib/canvas';
import { createClerkSupabaseServerClient } from '@/lib/supabase/server';
import { uploadImageToStorage } from '@/lib/uploadImage';

export const updateProjectOuptutImage = async (
  projectId: string,
  canvas: any,
) => {
  if (!canvas) return;
  const supabaseClient = await createClerkSupabaseServerClient();

  const { project, error } = await fetchProjectById(projectId);

  if (error || !project) {
    throw new Error('Project not found');
  }

  const image = renderCanvasToImage(canvas, 'png');
  const imageFile = new File([image], project?.name + Date.now(), {
    type: 'image/png',
  });

  const imageUrl = await uploadImageToStorage(imageFile, projectId);

  const { error: updateError } = await supabaseClient
    .from('projects')
    .update({
      output_image: imageUrl,
    })
    .eq('id', projectId);

  if (updateError) {
    throw updateError;
  }

  return { imageUrl };
};
