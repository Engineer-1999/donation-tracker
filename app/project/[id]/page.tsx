import { fetchProjectById } from '@/app/dashboard/[id]/actions';
import ClientCanvas from './_components/ClientCanvas';

const PublishedProjectPage = async ({ params }: { params: { id: string } }) => {
  const { project, error } = await fetchProjectById(params.id);

  if (error) {
    return <div>Error loading project: {error.message}</div>;
  }

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div className='relative w-screen h-screen flex items-center justify-center overflow-hidden bg-black'>
      <ClientCanvas project={project} />
    </div>
  );
};

export default PublishedProjectPage;
