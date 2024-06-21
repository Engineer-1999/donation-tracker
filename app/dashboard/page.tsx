import { createClerkSupabaseServerClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import ProjectCard from './projectCard';
import CreateNewProjectCard from './createNewProjectCard';

const DashboardPage = async () => {
  const client = await createClerkSupabaseServerClient();

  const { data: projects, error } = await client.from('projects').select();

  if (error) {
    return notFound();
  }

  return (
    <div className='container p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
      <CreateNewProjectCard />
    </div>
  );
};

export default DashboardPage;
