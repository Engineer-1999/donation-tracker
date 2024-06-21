import { Project, Transaction } from '@/lib/supabase/schema';
import { createClerkSupabaseServerClient } from '@/lib/supabase/server';

export async function fetchProjectById(id: string) {
  'use server';
  const client = await createClerkSupabaseServerClient();

  const { data: project, error } = await client
    .from('projects')
    .select()
    .match({ id })
    .returns<Project[]>()
    .single();

  return { project, error };
}

export async function fetchTransactionsByProjectId(id: string) {
  'use server';
  const client = await createClerkSupabaseServerClient();

  const { data: transactions, error } = await client
    .from('transactions')
    .select()
    .match({
      project_id: id,
    })
    .returns<Transaction[]>()
    .order('created_at', { ascending: false });

  return { transactions, error };
}

export async function updateProgressValue(
  id: string,
  transactionAmount: number,
) {
  'use server';
  const client = await createClerkSupabaseServerClient();
  const { project } = await fetchProjectById(id);

  if (!project) {
    return { error: 'Project not found' };
  }

  const { error } = await client
    .from('projects')
    .update({
      progress: project.progress + transactionAmount,
    })
    .match({ id });

  return { error };
}
