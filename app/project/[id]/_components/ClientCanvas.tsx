'use client';

import { initializeFabric } from '@/lib/canvas';
import { Project } from '@/lib/supabase/schema';
import { fabric } from 'fabric-pure-browser';
import { useEffect, useRef, useState } from 'react';
import { updateProjectOuptutImage } from '../updateProjectOuptutImage';
import Controls from './controls';

interface ClientCanvasProps {
  project: Project;
}

const ClientCanvas: React.FC<ClientCanvasProps> = ({ project }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = initializeFabric({
      canvasRef,
      fabricRef,
    });

    fabricRef.current = canvas;
    setIsReady(true);

    return () => {
      canvas.dispose();
    };
  }, [project.canvas]);

  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas || !isReady) return;

    const updateOutput = async () => {
      try {
        console.log('updating');
        const output = await updateProjectOuptutImage(project, canvas);
        console.log(output);
      } catch (error) {
        console.error('Failed to update project output image:', error);
      }
    };

    canvas.loadFromJSON(project.canvas, () => {
      canvas.renderAll();
      updateOutput();
    });
  }, [isReady, project, project.canvas]);

  return (
    <>
      <canvas ref={canvasRef} />
      <Controls />
    </>
  );
};

export default ClientCanvas;
