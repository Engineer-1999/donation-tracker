'use client';

import {
  handleKeyDown,
  initializeFabric,
  setBackgroundImage,
  setupCanvasEventListeners,
} from '@/lib/canvas';
import { Project } from '@/lib/supabase/schema';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useCanvas } from '../hooks/CanvasContext';
import Canvas from './canvas';
import Sidebar from './sidebar';

type EditorProps = {
  project: Project;
};

const Editor = ({ project }: EditorProps) => {
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    fabricRef,
    setIsReady,
    isReady,
    backgroundImageUrl,
    setBackgroundImageUrl,
  } = useCanvas();

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    const initCanvas = () => {
      const canvas = initializeFabric({
        canvasRef,
        fabricRef,
      });

      if (canvas) {
        setupCanvasEventListeners(canvas);
      }
      return canvas;
    };

    const canvas = initCanvas();
    setIsReady(true);

    return () => {
      if (canvas) {
        canvas.dispose();
      }
    };
  }, [canvasRef, fabricRef, setIsReady]);

  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const keyDownHandler = (e: KeyboardEvent) => handleKeyDown(e, canvas);
    window.addEventListener('keydown', keyDownHandler);
    return () => window.removeEventListener('keydown', keyDownHandler);
  }, [fabricRef]);

  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas || !isReady) return;

    if (project.canvas) {
      console.log(project.canvas);
      canvas.loadFromJSON(project.canvas, () => {
        canvas.renderAll();
      });
    }
  }, [fabricRef, isReady, project.canvas]);

  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas || !backgroundImageUrl || !isReady) return;
    setBackgroundImage(canvas, backgroundImageUrl);
  }, [backgroundImageUrl, fabricRef, isReady]);

  useEffect(() => {
    if (project.image_url && !backgroundImageUrl) {
      setBackgroundImageUrl(project.image_url);
    }
  }, [backgroundImageUrl, project.image_url, setBackgroundImageUrl]);

  return (
    <main
      className={cn('relative w-screen h-[calc(100vh-4rem)] overflow-hidden')}
    >
      {isMobile ? (
        <div className='flex h-full items-center justify-center'>
          <p>هذه الصفحة غير متوفرة على الهاتف المحمول</p>
        </div>
      ) : (
        <div className='w-screen grid h-full grid-cols-4 bg-neutral-50'>
          <Sidebar
            project={project}
            isLoadingImage={isLoadingImage}
            setIsLoadingImage={setIsLoadingImage}
          />
          <div className='relative col-span-3 h-full w-full flex items-center justify-center'>
            <Canvas ref={canvasRef} />
            {isLoadingImage && (
              <div className='absolute inset-0 z-50 flex flex-col items-center justify-center pointer-events-none select-none'>
                <div className='w-[800px] h-[800px] bg-black/60 flex flex-col items-center justify-center'>
                  <Loader2 className='w-12 h-12 text-white animate-spin' />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default Editor;
