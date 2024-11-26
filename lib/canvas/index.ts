import { syncCanvasWithDatabase } from '@/app/dashboard/editor/[id]/actions';
import { formatCurrency, formatPercentage } from '@/lib/formatNumbers';
import { Project } from '@/lib/supabase/schema';
import { fabric } from 'fabric-pure-browser';
import { createScalableProgressBar } from './elements';
import { ProgressBarVariant } from './types';

export const initializeFabric = ({
  fabricRef,
  canvasRef,
  width,
  height,
}: {
  fabricRef: React.MutableRefObject<fabric.Canvas | null>;
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
  width: number;
  height: number;
}) => {
  const canvas = new fabric.Canvas(canvasRef.current, {
    width,
    height,
  });

  fabricRef.current = canvas;
  return canvas;
};

export const initializeCanvas = ({
  canvasRef,
  fabricRef,
  width,
  height,
}: {
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
  fabricRef: React.MutableRefObject<fabric.Canvas | null>;
  width: number;
  height: number;
}) => {
  const canvas = initializeFabric({ canvasRef, fabricRef, width, height });
  if (canvas) {
    setupCanvasEventListeners(canvas);
  }
  return canvas;
};

export const updateCanvasSize = ({
  canvas,
  width,
  height,
}: {
  canvas: fabric.Canvas;
  width: number;
  height: number;
}) => {
  if (!canvas) return;

  canvas.setWidth(width);
  canvas.setHeight(height);

  canvas.renderAll();
};

export const renderCanvasToImage = (canvas: fabric.Canvas, format = 'png', quality = 1) => {
  canvas.renderAll();

  const dataURL = canvas.toDataURL({
    format,
    quality,
  });

  return dataURL;
};

export const downloadImage = (canvas: fabric.Canvas, fileName = 'image.png', format = 'png') => {
  const dataURL = renderCanvasToImage(canvas, format);

  const link = document.createElement('a');
  link.download = fileName;
  link.href = dataURL;

  link.click();
};

export const handleKeyDown = (e: KeyboardEvent, canvas: fabric.Canvas) => {
  if (e.key === 'Backspace' || e.key === 'Delete') {
    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length > 0) {
      activeObjects.forEach((obj) => removeElement({ canvas, type: obj.data?.type }));
      canvas.discardActiveObject().renderAll();
    }
  }
};

export const setupCanvasEventListeners = (canvas: fabric.Canvas) => {
  let guidelines: fabric.Line[] = [];

  const createGuideline = (coords: number[], color: string = 'rgba(255, 0, 0, 0.5)') => {
    return new fabric.Line(coords, {
      stroke: color,
      strokeWidth: 1,
      selectable: false,
      evented: false,
      strokeDashArray: [5, 5],
    });
  };

  const clearGuidelines = () => {
    guidelines.forEach((line) => canvas.remove(line));
    guidelines = [];
    canvas.renderAll();
  };

  canvas.on('object:moving', function (e) {
    const activeObject = e.target;
    if (!activeObject) return;

    clearGuidelines();

    const canvasWidth = canvas.width!;
    const canvasHeight = canvas.height!;
    const objectWidth = activeObject.getScaledWidth();
    const objectHeight = activeObject.getScaledHeight();

    const threshold = 10;

    canvas.forEachObject(function (obj) {
      if (obj === activeObject) return;

      // Vertical alignment
      if (Math.abs(activeObject.left! - obj.left!) < threshold) {
        activeObject.set({ left: obj.left });
        guidelines.push(createGuideline([obj.left!, 0, obj.left!, canvasHeight]));
      }

      // Horizontal alignment
      if (Math.abs(activeObject.top! - obj.top!) < threshold) {
        activeObject.set({ top: obj.top });
        guidelines.push(createGuideline([0, obj.top!, canvasWidth, obj.top!]));
      }
    });

    // Vertical centering
    if (Math.abs(activeObject.left! + objectWidth / 2 - canvasWidth / 2) < threshold) {
      activeObject.set({ left: canvasWidth / 2 - objectWidth / 2 });
      guidelines.push(
        createGuideline(
          [canvasWidth / 2, 0, canvasWidth / 2, canvasHeight],
          'rgba(0, 255, 0, 0.5)',
        ),
      );
    }

    // Horizontal centering
    if (Math.abs(activeObject.top! + objectHeight / 2 - canvasHeight / 2) < threshold) {
      activeObject.set({ top: canvasHeight / 2 - objectHeight / 2 });
      guidelines.push(
        createGuideline(
          [0, canvasHeight / 2, canvasWidth, canvasHeight / 2],
          'rgba(0, 255, 0, 0.5)',
        ),
      );
    }

    guidelines.forEach((line) => canvas.add(line));
    canvas.renderAll();
  });

  canvas.on('object:modified', clearGuidelines);
  canvas.on('selection:cleared', clearGuidelines);

  canvas.on('mouse:up', function () {
    if (!canvas.getActiveObject()) {
      clearGuidelines();
    }
  });
};

export const hasElement = ({
  canvas,
  type,
}: {
  canvas: fabric.Canvas | null;
  type: string;
}): boolean => {
  if (!canvas) return false;

  return canvas.getObjects().some((obj) => obj.data?.type === type) ?? false;
};

export const getElementByType = ({
  canvas,
  type,
}: {
  canvas: fabric.Canvas | null;
  type: string;
}) => {
  if (!canvas || !hasElement({ canvas, type })) return null;

  return canvas.getObjects().find((obj) => obj.data?.type === type);
};

export const removeElement = ({ canvas, type }: { canvas: fabric.Canvas | null; type: string }) => {
  if (!canvas) return;
  console.log('removing element', type);

  const element = getElementByType({ canvas, type });

  if (element) {
    canvas.discardActiveObject();
    canvas.remove(element);
    canvas.renderAll();
  }
};

export const updateColor = ({ canvas, color }: { canvas: fabric.Canvas | null; color: string }) => {
  if (!canvas) return;

  const activeElements = canvas.getActiveObjects();
  console.log(activeElements);
  activeElements.forEach((element) => {
    element.set('fill', color);
  });

  canvas.renderAll();
};

export const updateText = ({
  canvas,
  element,
  text,
}: {
  canvas: fabric.Canvas | null;
  element: fabric.Text;
  text: string;
}) => {
  if (!canvas) return;

  if (element) {
    element.set('text', text);
    canvas.bringToFront(element);
    canvas.discardActiveObject();
    canvas.renderAll();
  }
};

export const updateProgressBar = async ({
  canvas,
  element,
  options,
}: {
  canvas: fabric.Canvas | null;
  element: fabric.Object;
  options: {
    progress?: number;
    color?: string;
    shape?: ProgressBarVariant;
  };
}) => {
  if (!canvas) return;
  console.log('updating progress bar', options);

  try {
    await createScalableProgressBar(canvas, {
      type: 'progressBar',
      width: element?.width ?? 600,
      left: element?.left ?? 50,
      top: element?.top ?? 50,
      scaleX: element?.scaleX ?? 1,
      scaleY: element?.scaleY ?? 1,
      progress: options.progress ?? element.data?.progress ?? 0,
      color: options.color ?? element.data?.color ?? '#000',
      shape: options.shape ?? element.data?.shape ?? 'rounded',
    });
  } catch (error) {
    console.error('Error updating progress bar:', error);
  }
};

export const loadCanvasFromJSON = (canvas: fabric.Canvas, jsonData: JSON, callback: () => void) => {
  if (!jsonData) return;
  try {
    canvas.loadFromJSON(jsonData, () => {
      callback();
    });
  } catch (error) {
    console.error('Error loading canvas:', error);
  }
};

export const setupKeyboardEvents = (canvas: fabric.Canvas, isDesignMode: boolean) => {
  if (!isDesignMode) return;

  const keyDownHandler = (e: KeyboardEvent) => handleKeyDown(e, canvas);
  window.addEventListener('keydown', keyDownHandler);

  return () => window.removeEventListener('keydown', keyDownHandler);
};

export const updateCanvasElements = (
  canvas: fabric.Canvas,
  project: Project,
  isDesignMode: boolean,
) => {
  if (!isDesignMode) {
    const progressBarElement = getElementByType({ canvas, type: 'progressBar' }) as fabric.Object;
    if (progressBarElement) {
      updateProgressBar({
        canvas,
        element: progressBarElement,
        options: {
          progress: 100 * (parseFloat(project.progress) / parseFloat(project.target_goal)),
        },
      });
    }

    const elements = [
      {
        type: 'percentageText',
        text: formatPercentage(parseFloat(project.progress) / parseFloat(project.target_goal)),
      },
      { type: 'totalAmountText', text: formatCurrency(parseFloat(project.target_goal)) },
      { type: 'progressAmountText', text: formatCurrency(parseFloat(project.progress)) },
    ];

    elements.forEach(({ type, text }) => {
      const element = getElementByType({ canvas, type }) as fabric.Text;
      if (element) {
        updateText({ canvas, element, text });
      }
    });

    // Make canvas uneditable when not in design mode
    canvas.selection = false;
    canvas.forEachObject((obj) => {
      obj.selectable = false;
      obj.evented = false;
    });

    canvas.renderAll();
  }
};

export const saveCanvas = async (canvas: fabric.Canvas, projectId: string) => {
  if (!canvas) return;
  const canvasJson = canvas.toJSON(['data']);
  await syncCanvasWithDatabase({ projectId, canvas: canvasJson });
};
