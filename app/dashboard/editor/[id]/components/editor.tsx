'use client';

import { initializeFabric, setBackgroundImage } from '@/lib/canvas';
import { extractColors } from '@/lib/canvas/colors';
import { Project } from '@/lib/supabase/schema';
import { cn } from '@/lib/utils';
import { fabric } from 'fabric-pure-browser';
import { Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Canvas from './canvas';
import Sidebar from './sidebar';

type EditorProps = {
  project: Project;
};

const Editor = ({ project }: EditorProps) => {
  const [imageUrl, setImageUrl] = useState<string>(project.image_url);
  const [projectColor, setProjectColor] = useState<string>(
    project.color ?? '#000',
  );

  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [isCanvasReady, setIsCanvasReady] = useState(false);

  const [dominantColors, setDominantColors] = useState<string[]>([]);
  const [isColorPicking, setIsColorPicking] = useState(false);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const img = document.createElement('img');
    img.src = imageUrl;
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const colors = extractColors(img);
      if (!colors) return;
      setDominantColors(colors);
    };
  }, [imageUrl]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }, []);

  useEffect(() => {
    const canvas = initializeFabric({
      canvasRef,
      fabricRef,
    });

    setIsCanvasReady(true);

    return () => {
      canvas?.dispose();
    };
  }, []);

  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas || !isCanvasReady) return;

    if (project.canvas) {
      canvas.loadFromJSON(project.canvas, () => {
        setIsCanvasReady(true);
      });
    }
  }, [isCanvasReady, project.canvas]);

  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Backspace') {
        const activeObjects = canvas.getActiveObjects();
        if (!activeObjects) return;
        activeObjects.forEach((activeObject) => {
          canvas.remove(activeObject);
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas || !imageUrl || !isCanvasReady) return;
    setBackgroundImage(canvas, imageUrl);
  }, [imageUrl, isCanvasReady]);

  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    canvas.defaultCursor = isColorPicking ? 'crosshair' : 'default';

    return () => {
      canvas.defaultCursor = 'default';
    };
  }, [isColorPicking]);

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
            imageUrl={imageUrl}
            setImageUrl={setImageUrl}
            canvas={fabricRef.current}
            isLoadingImage={isLoadingImage}
            setIsLoadingImage={setIsLoadingImage}
            dominantColors={dominantColors}
            projectColor={projectColor}
            setProjectColor={setProjectColor}
            setIsColorPicking={setIsColorPicking}
            isColorPicking={isColorPicking}
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
