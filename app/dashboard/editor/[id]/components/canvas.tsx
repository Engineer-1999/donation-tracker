'use client';

import {
  getElementByType,
  handleKeyDown,
  initializeFabric,
  setBackgroundImage,
  setupCanvasEventListeners,
  updateProgressBar,
  updateText,
} from '@/lib/canvas';
import { formatCurrency, formatPercentage } from '@/lib/formatNumbers';
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
    if (!canvas || !isReady) return;
    setBackgroundImage(canvas, project.image_url);
  }, [fabricRef, isReady, project.image_url]);

  const updateActualValues = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas || !isReady) return;

    const percentageTextElement = getElementByType({
      canvas,
      type: 'percentageText',
    });

    const totalAmountElement = getElementByType({
      canvas,
      type: 'totalAmountText',
    });

    const progressAmountElement = getElementByType({
      canvas,
      type: 'progressAmountText',
    });

    updateProgressBar({
      canvas,
      element: getElementByType({ canvas, type: 'progressBar' }) as fabric.Object,
      options: {
        progress: 100 * (parseFloat(project.progress) / parseFloat(project.target_goal)),
      },
    });

    updateText({
      canvas,
      element: percentageTextElement as fabric.Text,
      text: formatPercentage(parseFloat(project.progress) / parseFloat(project.target_goal)),
    });

    updateText({
      canvas,
      element: totalAmountElement as fabric.Text,
      text: formatCurrency(parseFloat(project.target_goal)),
    });

    updateText({
      canvas,
      element: progressAmountElement as fabric.Text,
      text: formatCurrency(parseFloat(project.progress)),
    });

    // Make canvas uneditable when not in design mode
    canvas.selection = isDesignMode;
    canvas.forEachObject((obj) => {
      obj.selectable = isDesignMode;
      obj.evented = isDesignMode;
    });
  }, [fabricRef, isReady, isDesignMode, project]);

  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas || !isReady) return;

    if (project.canvas) {
      try {
        canvas.loadFromJSON(project.canvas, () => {
          console.log('Canvas loaded successfully');
          if (canvas && project && !isDesignMode) {
            updateActualValues();
          }
          canvas.renderAll();
        });
      } catch (error) {
        console.error('Error loading canvas:', error);
      }
    }
  }, [fabricRef, isDesignMode, isReady, project, project.canvas, updateActualValues]);

  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    let keyDownHandler: (e: KeyboardEvent) => void;

    if (isDesignMode) {
      keyDownHandler = (e: KeyboardEvent) => handleKeyDown(e, canvas);
      window.addEventListener('keydown', keyDownHandler);
    }

    return () => {
      if (keyDownHandler) {
        window.removeEventListener('keydown', keyDownHandler);
      }
    };
  }, [fabricRef, isDesignMode]);

  return (
    <div className='w-screen grid h-full grid-cols-4 bg-neutral-50'>
      {isDesignMode && (
        <Sidebar
          project={project}
          isLoadingImage={isLoadingImage}
          setIsLoadingImage={setIsLoadingImage}
        />
      )}
      <div
        className={cn('relative col-span-3 h-full w-full flex items-center justify-center', {
          'col-span-4': !isDesignMode,
        })}
      >
        <canvas ref={canvasRef} {...props} />
        {isLoadingImage && (
          <div className='absolute inset-0 z-50 flex flex-col items-center justify-center pointer-events-none select-none'>
            <div className='w-[800px] h-[800px] bg-black/60 flex flex-col items-center justify-center'>
              <Loader2 className='w-12 h-12 text-white animate-spin' />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Canvas;
