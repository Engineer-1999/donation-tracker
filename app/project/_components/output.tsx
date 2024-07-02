'use client';

import { Project } from '@/lib/supabase/schema';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import Controls from './controls';
import OutputProgress from './outputProgress';

const Output = ({
  project,
  updateProject,
}: {
  project: Project;
  updateProject: (projectId: string, data: any) => Promise<Project>;
}) => {
  const [projectSettings, setProjectSettings] = useState(
    project.settings || {},
  );

  return (
    <>
      <div className='relative w-full md:w-auto md:h-full aspect-square bg-red-100'>
        <Image
          src={project.image_url}
          alt={project.name}
          width={1000}
          height={1000}
          className='object-contain h-full w-full'
        />
        <motion.div
          layout
          className='absolute inset-x-0 px-4 md:px-10'
          style={{
            bottom: `calc(13% + ${projectSettings.displacement || 0}px)`,
          }}
        >
          <OutputProgress
            project={project}
            className='h-8 md:h-16 text-lg md:text-3xl'
            padding={projectSettings.padding}
            shape={projectSettings.shape}
            showPercentage={projectSettings.showPercentage}
            size={800 + (projectSettings.size || 0)}
          />
        </motion.div>
      </div>
      <Controls
        className='absolute top-4 right-4'
        project={project}
        projectSettings={projectSettings}
        setProjectSettings={setProjectSettings}
        updateProject={updateProject}
      />
    </>
  );
};

export default Output;
