import { Project } from '@/lib/supabase/schema';
import { cn } from '@/lib/utils';
import { fabric } from 'fabric-pure-browser';
import { useEffect, useRef, useState } from 'react';

type CanvasProps = {
  className?: string;
  project: Project;
};

const Canvas = ({ project, className }: CanvasProps) => {
  const { image_url: image, progress, target_goal } = project;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [activeObject, setActiveObject] = useState<fabric.Object | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 800,
    });

    setCanvas(fabricCanvas);

    return () => {
      fabricCanvas?.dispose();
    };
  }, []);

  useEffect(() => {
    if (!canvas || !image) return;

    fabric.Image.fromURL(image, (img) => {
      img.set({
        left: 0,
        top: 0,
      });
      img.scaleToWidth(canvas.getWidth());
      img.scaleToHeight(canvas.getHeight());
      canvas.setBackgroundImage(img, () => canvas.renderAll());
    });
  }, [canvas, image]);

  const addRectangle = () => {
    if (!canvas || !project) return;

    const width = 700;
    const height = 70;

    const fillColor = project.color || '#fff';
    const borderRadius = height / 2;

    const progressPercentage = 0.6;

    const progressBarWidth = width * progressPercentage;

    const progressBarContainer = new fabric.Rect({
      width: width,
      height: height,
      fill: '#ddd',
      rx: borderRadius,
      ry: borderRadius,
    });

    const progressBar = new fabric.Rect({
      width: progressBarWidth,
      height: height - 10,
      top: 5,
      left: width - progressBarWidth - 5,
      fill: fillColor,
      rx: borderRadius,
      ry: borderRadius,
    });

    const group = new fabric.Group([progressBarContainer, progressBar], {
      left: 50,
      top: 600,
      shadow: new fabric.Shadow({
        blur: 30,
        color: 'rgba(0,0,0,0.2)',
        offsetX: 0,
        offsetY: 0,
      }),
    });

    canvas.add(group);
    setActiveObject(group);
  };

  useEffect(() => {
    if (!canvas || !activeObject) return;

    const onDeleteKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Backspace') {
        canvas.remove(activeObject);
        setActiveObject(null);
      }
    };

    document.addEventListener('keydown', onDeleteKeyDown);

    return () => {
      document.removeEventListener('keydown', onDeleteKeyDown);
    };
  }, [canvas, activeObject]);

  return (
    <div
      className={cn(
        'absolute h-full p-4 overflow-y-auto flex flex-col items-center justify-center',
        className,
      )}
    >
      <button onClick={addRectangle}>Add Rectangle</button>
      <canvas
        ref={canvasRef}
        className='border border-neutral-200 w-[800px] h-[800px]'
      />
    </div>
  );
};

export default Canvas;
