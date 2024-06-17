import { createClerkSupabaseServerClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';

const page = async ({ params }: { params: { id: string } }) => {
  const client = await createClerkSupabaseServerClient();

  const { data: project, error } = await client
    .from('projects')
    .select()
    .match({
      id: params.id,
    })
    .single();

  if (error) {
    return notFound();
  }

  return <div className='container p-5'>{project.name}</div>;
};

export default page;
