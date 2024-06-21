import { notFound } from 'next/navigation';
import { fetchProjects } from './actions';
import CreateNewProjectCard from './createNewProjectCard';
import ProjectCard from './projectCard';

const DashboardPage = async () => {
  const { projects, error } = await fetchProjects();

  if (error || !projects) {
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
