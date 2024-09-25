'use client';

import { Project } from '@/lib/supabase/schema';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { useCanvas } from '../hooks/CanvasContext';
import Canvas from './canvas';

type EditorProps = {
  project: Project;
};

const Editor = ({ project }: EditorProps) => {
  const [isMobile, setIsMobile] = useState(false);

  const { fabricRef } = useCanvas();

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  return (
    <main className={cn('relative w-screen h-[calc(100vh-4rem)] overflow-hidden')}>
      {isMobile ? (
        <div className='flex h-full items-center justify-center'>
          <p>هذه الصفحة غير متوفرة على الهاتف المحمول</p>
        </div>
      ) : (
        <Canvas project={project} isDesignMode={true} />
      )}
    </main>
  );
};

export default Editor;
