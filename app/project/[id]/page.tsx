import { fetchProjectById } from '@/app/dashboard/[id]/actions';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import FullScreenButton from '../_components/fullScreenButton';
import OutputProgress from '../_components/outputProgress';

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
      <OutputProgress project={project} />
      <FullScreenButton className='absolute top-4 right-4' />
    </div>
  );
};

export default PublishedProjectPage;
