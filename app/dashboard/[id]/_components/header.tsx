'use client';

import { supabaseClient } from '@/lib/supabase/client';
import { Project } from '@/lib/supabase/schema';
import DashboardBreadcrumb from '../../_components/breadcrumb';
import ProjectContorls from './projectContorls';

type ProjectHeaderProps = {
  project: Project;
};

const ProjectHeader = ({ project }: ProjectHeaderProps) => {
  const updateProjectPublished = async (value: boolean) => {
    const { status, error } = await supabaseClient
      .from('projects')
      .update({ is_published: value })
      .match({
        id: project.id,
      });

    if (error) {
      console.error(error);
    }

    return { status, error };
  };

  const canvas = project.canvas as unknown as fabric.Canvas;

  return (
    <header className='py-5 flex items-center justify-between flex-wrap gap-4'>
      <DashboardBreadcrumb title={project.name || 'المشروع'} />
      <ProjectContorls
        hasAnImage={!!canvas?.backgroundImage}
        isPublishedProject={project.is_published}
        onPublishChange={updateProjectPublished}
        id={project.id}
      />
    </header>
  );
};

export default ProjectHeader;
