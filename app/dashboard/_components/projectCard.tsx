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
import { formatDate } from '@/lib/formatNumbers';
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
      <div className='flex items-center justify-between p-3'>
        <span className='text-sm text-gray-500 p-3'>
          {formatDate(project.created_at)}
        </span>
        <Menubar className='bg-transparent'>
          <MenubarMenu>
            <MenubarTrigger>
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
    </section>
  );
};

export default ProjectCard;
