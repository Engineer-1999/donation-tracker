import { Project, ProjectSettings } from '@/lib/supabase/schema';
import { cn } from '@/lib/utils';
import { Dispatch, SetStateAction } from 'react';
import ControlsSlider from './controlsSlider';

type SidebarProps = {
  project: Project;
  projectSettings: ProjectSettings;
  setProjectSettings: Dispatch<SetStateAction<ProjectSettings>>;
  updateProject: (projectId: string, data: any) => Promise<Project>;
  className?: string;
};

const Sidebar = ({
  project,
  projectSettings,
  setProjectSettings,
  updateProject,
  className,
}: SidebarProps) => {
  return (
    <div
      className={cn(
        'absolute right-0 inset-y-0 flex flex-col gap-4 p-4 border-l border-neutral-200',
        className,
      )}
    >
      <ControlsSlider
        project={project}
        projectSettings={projectSettings}
        setProjectSettings={setProjectSettings}
        updateProject={updateProject}
      />
    </div>
  );
};

export default Sidebar;
