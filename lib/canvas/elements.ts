import { createProgressBarShapeSVG, ProgressBarShapeProps } from '@/components/shapes/progressBar';
import { fabric } from 'fabric-pure-browser';
import { v4 as uuidv4 } from 'uuid';

type ElementType = 'text' | 'progressBar';

export function createElement({
  canvas,
  type,
  options,
}: {
  canvas: fabric.Canvas;
  type: ElementType;
  options: (fabric.IObjectOptions & ProgressBarShapeProps) | fabric.ITextOptions;
}) {
  switch (type) {
    case 'text':
      return createTextElement(canvas, options);
    case 'progressBar':
      return createScalableProgressBar(canvas, options);
    default:
      throw new Error(`Unsupported element type: ${options.type}`);
  }
}

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
  const { width = 600, height = 70, left = 50, top = 60, ...restOptions } = options;
  const svgString = createProgressBarShapeSVG({ width, ...restOptions });

  fabric.loadSVGFromString(svgString, (objects, svgOptions) => {
    if (objects.length === 0) {
      throw new Error('Failed to load SVG');
    }

    const group = fabric.util.groupSVGElements(objects, svgOptions);
    const scalableProgressBar = createProgressBarGroup(group, {
      width,
      height,
      left,
      top,
      data: { type: 'progressBar' },
      ...options,
      type: 'group',
    });

    disableMiddleControls(scalableProgressBar);
    addToCanvas(canvas, scalableProgressBar);
  });
}

function createProgressBarGroup(group: fabric.Object, options: fabric.IGroupOptions): fabric.Group {
  return new fabric.Group([group], options);
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
