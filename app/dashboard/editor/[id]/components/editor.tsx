'use client';

import { Project } from '@/lib/supabase/schema';
import { useState } from 'react';
import { updateProject } from '../actions';
import Canvas from './canvas';
import Sidebar from './sidebar';

type EditorProps = {
  project: Project;
};

const Editor = ({ project }: EditorProps) => {
  const [projectSettings, setProjectSettings] = useState(
    project.settings || {},
  );

  return (
    <main className='relative w-screen h-[calc(100vh-4rem)] overflow-hidden'>
      <Sidebar
        project={project}
        projectSettings={projectSettings}
        setProjectSettings={setProjectSettings}
        updateProject={updateProject}
        className={`w-[480px]`}
      />
      <Canvas
        project={project}
        className={`w-[calc(100%-480px)] right-[480px]`}
      />
    </main>
  );
};

export default Editor;
