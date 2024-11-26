'use server';

import { Project } from '@/lib/supabase/schema';
import { createClerkSupabaseServerClient } from '@/lib/supabase/server';

export const updateProject = async ({ projectId, data }: { projectId: string; data: any }) => {
  const supabaseClient = await createClerkSupabaseServerClient();

  const { data: project, error } = await supabaseClient
    .from('projects')
    .update(data)
    .eq('id', projectId)
    .returns<Project[]>()
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return project;
};

export const syncCanvasWithDatabase = async ({
  projectId,
  canvas,
}: {
  projectId: string;
  canvas: any;
}) => {
  const supabaseClient = await createClerkSupabaseServerClient();

  const { error } = await supabaseClient
    .from('projects')
    .update({
      canvas,
    })
    .eq('id', projectId);

  if (error) {
    console.error('Error syncing canvas with database:', error);
    throw error;
  }

  return { error };
};
