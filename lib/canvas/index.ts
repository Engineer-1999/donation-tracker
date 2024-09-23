import { fabric } from 'fabric-pure-browser';

// initialize fabric canvas
export const initializeFabric = ({
  fabricRef,
  canvasRef,
}: {
  fabricRef: React.MutableRefObject<fabric.Canvas | null>;
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
}) => {
  const canvas = new fabric.Canvas(canvasRef.current, {
    width: 800,
    height: 800,
  });

  fabricRef.current = canvas;
  return canvas;
};

export const setBackgroundImage = (canvas: fabric.Canvas, imageUrl: string) => {
  if (!canvas) return;
  fabric.Image.fromURL(
    imageUrl,
    (img) => {
      img.set({
        left: 0,
        top: 0,
      });
      img.scaleToWidth(canvas.getWidth());
      img.scaleToHeight(canvas.getHeight());

      canvas.setBackgroundImage(img, () => canvas.renderAll());
    },
    { crossOrigin: 'anonymous' },
  );
};

export const renderCanvasToImage = (canvas: fabric.Canvas, format = 'png') => {
  canvas.renderAll();

  const dataURL = canvas.toDataURL({
    format,
    quality: 1,
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
      activeObjects.forEach((obj) => canvas.remove(obj));
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

  const element = getElementByType({ canvas, type });
  if (element) {
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
