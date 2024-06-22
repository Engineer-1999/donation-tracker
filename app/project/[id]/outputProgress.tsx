'use client';

import { Progress } from '@/components/ui/progress';
import { supabaseClient } from '@/lib/supabase/client';
import { Project } from '@/lib/supabase/schema';
import { useEffect, useState } from 'react';

const OutputProgress = ({ project: initialProject }: { project: Project }) => {
  const [project, setProject] = useState<Project>(initialProject);

  useEffect(() => {
    const channel = supabaseClient
      .channel('realtime project updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'projects',
        },
        (payload) => {
          const { new: newProject } = payload;
          setProject(newProject as Project);
        },
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [project]);

  return (
    <Progress
      value={parseFloat(project.progress)}
      target={parseFloat(project.target_goal)}
      color={project.color}
      showPercentage
      className='absolute bottom-[32%] md:bottom-[22%] xl:bottom-[13%] h-10 md:h-16 text-2xl w-[90%] xl:w-[46%] border-4 shadow-sm rounded-xl'
    />
  );
};

export default OutputProgress;
