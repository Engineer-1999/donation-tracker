import { fetchProjectById } from '@/app/dashboard/[id]/actions';
import { notFound } from 'next/navigation';
import Output from '../_components/output';
import { updateProject } from './actions';

const PublishedProjectPage = async ({ params }: { params: { id: string } }) => {
  const { project, error } = await fetchProjectById(params.id);

  if (error || !project || !project.is_published) {
    notFound();
  }

  return (
    <div className='relative w-screen h-screen flex items-center justify-center overflow-hidden bg-black'>
      <Output project={project} updateProject={updateProject} />
    </div>
  );
};

export default PublishedProjectPage;
