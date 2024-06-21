import { fetchProjectById } from '@/app/dashboard/[id]/actions';
import { Progress } from '@/components/ui/progress';
import Image from 'next/image';
import { notFound } from 'next/navigation';

const PublishedProjectPage = async ({ params }: { params: { id: string } }) => {
  const { project, error } = await fetchProjectById(params.id);

  if (error || !project) {
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
