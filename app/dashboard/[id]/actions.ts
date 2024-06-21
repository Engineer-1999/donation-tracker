import { createClerkSupabaseServerClient } from "@/utils/supabase/server";

export async function fetchProjectById (id: string) {
  'use server'
  const client = await createClerkSupabaseServerClient();

  const { data: project, error } = await client
    .from('projects')
    .select()
    .match({ id })
    .single();

  return { project, error };
}

export async function fetchTransactionsByProjectId (id: string) {
  'use server'
  const client = await createClerkSupabaseServerClient();

  const { data: transactions, error } = await client
    .from('transactions')
    .select()
    .match({
      project_id: id,
    })
    .order('created_at', { ascending: false });

  return { transactions, error };
}

export async function updateProgressValue (id: string, transactionAmount: number) {
  'use server'
  const client = await createClerkSupabaseServerClient();
  const { project } = await fetchProjectById(id);

  const { error } = await client
    .from('projects')
    .update({
      progress: project.progress + transactionAmount,
    })
    .match({ id });

  return { error };
}