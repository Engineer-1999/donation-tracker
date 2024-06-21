import { Progress } from '@/components/ui/progress';
import { formatDate } from '@/lib/formatNumbers';
import { Project } from '@/lib/supabase/schema';
import Link from 'next/link';

type ProjectCardProps = {
  project: Project;
};

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <section className='rounded-lg bg-primary-50 border border-primary-100 overflow-hidden'>
      <Link
        href={`/dashboard/${project.id}`}
        className='block text-lg border-b border-primary-100 p-3 font-semibold text-white'
        style={{ backgroundColor: project.color }}
      >
        {project.name}
      </Link>
      <div className='flex items-center justify-between p-3'>
        <Progress
          value={parseFloat(project.progress)}
          target={parseFloat(project.target_goal)}
          color={project.color}
          showPercentage
        />
      </div>
      <div className='text-sm text-gray-500 p-3'>
        {formatDate(project.created_at)}
      </div>
    </section>
  );
};

export default ProjectCard;
