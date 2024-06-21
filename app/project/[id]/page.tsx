import { Progress } from '@/components/ui/progress';
import { Project } from '@/utils/supabase/schema';
import { createClerkSupabaseServerClient } from '@/utils/supabase/server';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import React from 'react';

const PublishedProjectPage = async ({ params }: { params: { id: string } }) => {
  const client = await createClerkSupabaseServerClient();

  const { data: project, error } = await client
    .from('projects')
    .select()
    .match({
      id: params.id,
    })
    .returns<Project[]>()
    .single();

  if (error) {
    return notFound();
  }

  if (!project.is_published) {
    console.log('not published');
    return notFound();
  }

  return (
    <div className='relative w-screen h-screen flex items-center justify-center overflow-hidden'>
      <Image
        src={project.image_url}
        alt={project.name}
        width={1000}
        height={1000}
        className='object-contain h-full w-full'
      />
      <Progress
        value={parseFloat(project.progress)}
        target={parseFloat(project.target_goal)}
        color={project.color}
        showPercentage
        className='absolute bottom-[32%] md:bottom-[22%] xl:bottom-[13%] h-10 md:h-16 text-2xl w-[90%] xl:w-[46%] border-4 shadow-sm rounded-xl'
      />
    </div>
  );
};

export default PublishedProjectPage;
