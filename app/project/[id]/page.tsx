import { fetchProjectById } from '@/app/dashboard/[id]/actions';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import OutputProgress from './outputProgress';

const PublishedProjectPage = async ({ params }: { params: { id: string } }) => {
  const { project, error } = await fetchProjectById(params.id);

  if (error || !project || !project.is_published) {
    notFound();
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
      <OutputProgress project={project} />
    </div>
  );
};

export default PublishedProjectPage;
