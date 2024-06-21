'use client';

import { Project } from '@/utils/supabase/schema';
import DashboardBreadcrumb from '../breadcrumb';
import PublishButton from './publishButton';
import { supabaseClient } from '@/utils/supabase/client';

const ProjectHeader = ({ project }: { project: Project }) => {
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

  console.log(project);

  return (
    <header className='py-5 flex items-center justify-between'>
      <DashboardBreadcrumb title={project.name} />
      <PublishButton
        isPublishedProject={project.is_published}
        onPublishChange={updateProjectPublished}
      />
    </header>
  );
};

export default ProjectHeader;
