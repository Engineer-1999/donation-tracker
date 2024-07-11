import { fetchProjectById } from '@/app/dashboard/[id]/actions';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Controls from './_components/controls';

const PublishedProjectPage = async ({ params }: { params: { id: string } }) => {
  const { project, error } = await fetchProjectById(params.id);

  if (error || !project || !project.is_published) {
    notFound();
  }

  return (
    <div className='relative w-screen h-screen flex items-center justify-center overflow-hidden bg-black'>
      <Image
        src={project.image_url}
        alt={project.name}
        width={1000}
        height={1000}
        className='object-contain h-full w-full'
      />
      <Controls />
    </div>
  );
};

export default PublishedProjectPage;
