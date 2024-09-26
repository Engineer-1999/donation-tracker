'use client';

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarShortcut,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { Progress } from '@/components/ui/progress';
import { formatDate, formatPercentage } from '@/lib/formatNumbers';
import { supabaseClient } from '@/lib/supabase/client';
import { Project } from '@/lib/supabase/schema';
import { EllipsisVertical, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type ProjectCardProps = {
  project: Project;
};

const ProjectCard = ({ project }: ProjectCardProps) => {
  const router = useRouter();

  const handleDeleteProject = async () => {
    const { error } = await supabaseClient
      .from('projects')
      .delete()
      .eq('id', project.id);

    if (error) {
      console.log(error);
    }

    router.refresh();
  };

  return (
    <section className='rounded-lg border border-primary-100 overflow-hidden flex flex-col justify-between hover:bg-gray-50/50'>
      <div className='flex items-center justify-between border-b border-primary-100 py-1 pr-4 pl-0.5'>
        <Link
          href={`/dashboard/${project.id}`}
          className='text-lg font-semibold hover:underline underline-offset-2'
          style={{ color: project.color }}
        >
          {project.name}
        </Link>
        <Menubar className='bg-transparent'>
          <MenubarMenu>
            <MenubarTrigger className='aspect-square'>
              <EllipsisVertical className='h-4 w-4' />
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem
                className='!text-red-500 font-medium hover:!bg-red-50 cursor-pointer'
                onClick={handleDeleteProject}
              >
                حذف المشروع
                <MenubarShortcut>
                  <Trash2 className='h-4 w-4 text-red-500' />
                </MenubarShortcut>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>

      <div className='flex items-center justify-between p-1'>
        <span className='text-sm text-gray-500 p-3'>
          {formatDate(project.created_at)}
        </span>
        <span className='text-sm text-gray-500 p-3'>
          {formatPercentage(
            parseFloat(project.progress) / parseFloat(project.target_goal),
          )}
        </span>
      </div>
      <div className='flex'>
        <Progress
          value={parseFloat(project.progress)}
          target={parseFloat(project.target_goal)}
          color={project.color}
          shape='square'
          size={800}
          className='h-5 w-full border-none'
        />
      </div>
    </section>
  );
};

export default ProjectCard;
