'use client';

import Canvas from '@/app/dashboard/editor/[id]/components/canvas';
import { useCanvas } from '@/app/dashboard/editor/[id]/hooks/CanvasContext';
import { renderCanvasToImage } from '@/lib/canvas';
import { supabaseClient } from '@/lib/supabase/client';
import { Project } from '@/lib/supabase/schema';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import Controls from './controls';

interface ClientCanvasProps {
  project: Project;
}

const ClientCanvas: React.FC<ClientCanvasProps> = ({ project }) => {
  const [projectState, setProjectState] = useState<Project>(project);
  const [renderedImage, setRenderedImage] = useState<string | null>(null);
  const { fabricRef } = useCanvas();
  const containerRef = useRef<HTMLDivElement>(null);

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
          setProjectState(newProject as Project);
        },
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [project]);

  useEffect(() => {
    const renderCanvas = () => {
      const canvas = fabricRef.current;
      if (canvas) {
        const imageDataURL = renderCanvasToImage(canvas);
        setRenderedImage(imageDataURL);
      }
    };

    // Render the canvas after a short delay to ensure all elements are loaded
    const timeoutId = setTimeout(renderCanvas, 500);

    return () => clearTimeout(timeoutId);
  }, [fabricRef, projectState]);

  return (
    <div ref={containerRef} className='relative w-full h-screen'>
      <div className='absolute inset-0' style={{ zIndex: -1 }}>
        <Canvas project={projectState} isDesignMode={false} />
      </div>
      {renderedImage && (
        <Image
          src={renderedImage}
          alt='Rendered Canvas'
          className='w-full h-full object-contain'
          width={800}
          height={800}
          quality={100}
        />
      )}
      <Controls containerRef={containerRef} />
    </div>
  );
};

export default ClientCanvas;
