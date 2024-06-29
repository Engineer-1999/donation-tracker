'use client';

import { Progress } from '@/components/ui/progress';
import { supabaseClient } from '@/lib/supabase/client';
import { Project } from '@/lib/supabase/schema';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

type OutputProgressProps = {
  project: Project;
  className?: string;
};
const OutputProgress = ({
  project: initialProject,
  className,
}: OutputProgressProps) => {
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
    <div>
      <Progress
        value={parseFloat(project.progress)}
        target={parseFloat(project.target_goal)}
        color={project.color}
        showPercentage
        indicatorClassName='rounded-full'
        className={cn('shadow-sm', className)}
      />
    </div>
  );
};

export default OutputProgress;
