import { createProgressBarShapeSVG, ProgressBarShapeProps } from '@/components/shapes/progressBar';
import { fabric } from 'fabric-pure-browser';
import { v4 as uuidv4 } from 'uuid';
import { removeElement } from '.';

type ElementType = 'text' | 'progressBar';

type CreateElementProps = {
  canvas: fabric.Canvas;
  type: ElementType;
  options: fabric.ITextOptions | (ProgressBarShapeProps & fabric.IObjectOptions);
};

export const createElement = ({ canvas, type, options }: CreateElementProps) => {
  console.log('creating element', type);
  switch (type) {
    case 'text':
      return createTextElement(canvas, options);
    case 'progressBar':
      return createScalableProgressBar(canvas, options);
    default:
      throw new Error(`Unsupported element type: ${options.type}`);
  }
};

function createTextElement(canvas: fabric.Canvas, options: fabric.ITextOptions) {
  const { text, type, ...textOptions } = options;
  const textElement = new fabric.Text(text || '', {
    left: 0,
    top: 0,
    fill: '#aabbcc',
    fontFamily: 'Helvetica',
    fontSize: 36,
    fontWeight: '400',
    objectId: uuidv4(),
    data: { type },
    ...textOptions,
  } as fabric.ITextOptions);
  canvas.add(textElement);
  canvas.bringToFront(textElement);
  canvas.renderAll();
  return textElement;
}

export function createScalableProgressBar(
  canvas: fabric.Canvas,
  options: ProgressBarShapeProps & fabric.IObjectOptions,
) {
  removeElement({ canvas, type: 'progressBar' });

  const { width = 600, height = 70, left = 50, top = 60, ...restOptions } = options;
  const svgString = createProgressBarShapeSVG({ width, ...restOptions });

  return new Promise<fabric.Group>((resolve, reject) => {
    fabric.loadSVGFromString(svgString, (objects, svgOptions) => {
      if (objects.length === 0) {
        reject(new Error('Failed to load SVG'));
        return;
      }

      const group = fabric.util.groupSVGElements(objects, svgOptions);
      const scalableProgressBar = createProgressBarGroup(group, {
        width,
        height,
        left,
        top,
        data: { type: 'progressBar', shape: options.shape, color: options.color },
        ...options,
        type: 'group',
      });

      disableMiddleControls(scalableProgressBar);
      canvas.add(scalableProgressBar);
      canvas.sendToBack(scalableProgressBar);
      canvas.renderAll();
      resolve(scalableProgressBar);
    });
  });
}

function createProgressBarGroup(group: fabric.Object, options: fabric.IGroupOptions): fabric.Group {
  const progressBarGroup = new fabric.Group([group], options);
  progressBarGroup.setCoords(); // Ensure coordinates are set
  return progressBarGroup;
}

function disableMiddleControls(object: fabric.Object) {
  object.setControlsVisibility({
    mt: false, // middle top
    mb: false, // middle bottom
    ml: false, // middle left
    mr: false, // middle right
  });
}

function addToCanvas(canvas: fabric.Canvas, object: fabric.Object) {
  canvas.add(object);
  canvas.renderAll();
}
