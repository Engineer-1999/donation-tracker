import { Project } from '@/lib/supabase/schema';
import { createClerkSupabaseServerClient } from '@/lib/supabase/server';
import { auth } from '@clerk/nextjs/server';

export async function fetchProjects() {
  const { userId } = auth();
  const client = await createClerkSupabaseServerClient();

  const { data: projects, error } = await client
    .from('projects')
    .select()
    .match({ user_id: userId })
    .returns<Project[]>()
    .order('created_at', { ascending: false });

  return { projects, error };
}
