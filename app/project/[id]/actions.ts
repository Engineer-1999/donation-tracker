'use server';

import { Project } from '@/lib/supabase/schema';
import { createClerkSupabaseServerClient } from '@/lib/supabase/server';

export const updateProject = async (projectId: string, data: any) => {
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
