import ProjectCard from '@/components/project-card';
import { createClerkSupabaseServerClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';

const DashboardPage = async () => {
  const client = await createClerkSupabaseServerClient();

  const { data: projects, error } = await client.from('projects').select();

  if (error) {
    return notFound();
  }

  return (
    <div className='container p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          name={project.name}
          createdAt={project.created_at}
          id={project.id}
        />
      ))}
    </div>
  );
};

export default DashboardPage;
