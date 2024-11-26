'use client';

import {
  initializeCanvas,
  loadCanvasFromJSON,
  setupKeyboardEvents,
  updateCanvasElements,
} from '@/lib/canvas';
import { Project } from '@/lib/supabase/schema';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useCanvas } from '../hooks/CanvasContext';
import Sidebar from './sidebar';

type CanvasProps = {
  project: Project;
  isDesignMode?: boolean;
};

const Canvas = ({ project, isDesignMode = false, ...props }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { fabricRef } = useCanvas();
  const [isReady, setIsReady] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  const initCanvas = useCallback(() => {
    const canvas = initializeCanvas({ canvasRef, fabricRef, width: 800, height: 800 });
    setIsReady(true);
    return canvas;
  }, [fabricRef]);

  useEffect(() => {
    const canvas = initCanvas();

    return () => {
      if (canvas) {
        canvas.dispose();
      }
    };
  }, [initCanvas]);

  const updateCanvas = useCallback(() => {
    if (!fabricRef.current || !isReady) return;
    updateCanvasElements(fabricRef.current, project, isDesignMode);
  }, [fabricRef, isReady, project, isDesignMode]);

  useEffect(() => {
    if (!fabricRef.current || !isReady || !project.canvas) return;
    loadCanvasFromJSON(fabricRef.current, project.canvas, updateCanvas);
  }, [fabricRef, isReady, project.canvas, updateCanvas]);

  useEffect(() => {
    if (!fabricRef.current) return;
    return setupKeyboardEvents(fabricRef.current, isDesignMode);
  }, [fabricRef, isDesignMode]);

  return (
    <div className='w-screen h-full bg-neutral-50'>
      {isDesignMode && (
        <Sidebar
          project={project}
          isLoadingImage={isLoadingImage}
          setIsLoadingImage={setIsLoadingImage}
        />
      )}

      <div className={cn('relative h-full w-full flex items-center justify-center')}>
        <div className='absolute h-[calc(100vh-6rem)] w-[calc(100vw-280px-3rem)] left-[1rem] bottom-[1rem] flex items-center justify-center'>
          <canvas
            ref={canvasRef}
            {...props}
            style={{
              border: '1px solid black',
            }}
          />
          {isLoadingImage && (
            <div className='absolute inset-0 w-full h-full flex items-center justify-center'>
              <Loader2 className='w-16 h-16 text-gray-500 animate-spin' />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Canvas;
