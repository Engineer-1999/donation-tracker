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
      <div className='relative w-full md:w-auto md:h-full aspect-square bg-red-100'>
        <Image
          src={project.image_url}
          alt={project.name}
          width={1000}
          height={1000}
          className='object-contain h-full w-full'
        />
        <div className='absolute bottom-[13%] md:bottom-[14%] inset-x-0 px-4 md:px-10'>
          <OutputProgress
            project={project}
            className='h-8 md:h-16 md:border-4 text-lg md:text-3xl rounded-full'
          />
        </div>
      </div>
      <FullScreenButton className='absolute top-4 right-4' />
    </div>
  );
};

export default PublishedProjectPage;
