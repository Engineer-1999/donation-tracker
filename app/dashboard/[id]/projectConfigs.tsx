'use client';

import { Project } from '@/lib/supabase/schema';
import { useState } from 'react';
import ProjectColor from './projectColor';
import ProjectImage from './projectImage';

const ProjectConfigs = ({ project }: { project: Project }) => {
  const [projectColor, setProjectColor] = useState(project.color);

  return (
    <section className='py-5 space-y-5'>
      <ProjectImage
        id={project.id}
        name={project.name}
        image_url={project.image_url}
        projectColor={project.color}
        setProjectColor={setProjectColor}
      />
      <ProjectColor
        id={project.id}
        projectColor={projectColor}
        setProjectColor={setProjectColor}
      />
    </section>
  );
};

export default ProjectConfigs;
