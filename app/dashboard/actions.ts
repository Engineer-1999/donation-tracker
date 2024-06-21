import { Project } from '@/lib/supabase/schema';
import { createClerkSupabaseServerClient } from '@/lib/supabase/server';

export async function fetchProjects() {
  'use server';
  const client = await createClerkSupabaseServerClient();

  const { data: projects, error } = await client
    .from('projects')
    .select()
    .returns<Project[]>()
    .order('created_at', { ascending: false });

  return { projects, error };
}
