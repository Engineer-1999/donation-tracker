import {
  createProgressBarShapeSVG,
  ProgressBarShapeProps,
} from '@/components/shapes/progressBar';
import { fabric } from 'fabric-pure-browser';
import { v4 as uuidv4 } from 'uuid';

export function createScalableProgressBar(
  canvas: fabric.Canvas,
  options: ProgressBarShapeProps & fabric.IObjectOptions,
) {
  const { width = 600, height = 70, ...restOptions } = options;
  const svgString = createProgressBarShapeSVG({
    width,
    ...restOptions,
  });

  fabric.loadSVGFromString(svgString, (objects, svgOptions) => {
    if (objects.length === 0) {
      throw new Error('Failed to load SVG');
    }

    const group = fabric.util.groupSVGElements(objects, svgOptions);
    const scalableProgressBar = new fabric.Group([group], {
      ...options,
      left: 50,
      top: 60,
      width,
      height,
    });

    scalableProgressBar.setControlsVisibility({
      mt: false, // middle top
      mb: false, // middle bottom
      ml: false, // middle left
      mr: false, // middle right
    });

    // scalableProgressBar.on('scaling', (event: fabric.IEvent) => {
    //   const target = event.target as fabric.Object;

    //   if (
    //     !target ||
    //     typeof target.getScaledWidth !== 'function' ||
    //     typeof target.getScaledHeight !== 'function'
    //   ) {
    //     console.error('Invalid target object');
    //     return;
    //   }

    //   const newWidth = target.getScaledWidth();
    //   const newHeight = target.getScaledHeight();

    //   const updatedSvgString = createProgressBarShapeSVG({
    //     ...restOptions,
    //     width: newWidth,
    //     height: newHeight,
    //   });

    //   fabric.loadSVGFromString(
    //     updatedSvgString,
    //     (newObjects, newSvgOptions) => {
    //       const newGroup = fabric.util.groupSVGElements(
    //         newObjects,
    //         newSvgOptions,
    //       );

    //       if (target instanceof fabric.Group) {
    //         target.removeWithUpdate(target.item(0));
    //         target.addWithUpdate(newGroup);
    //       } else {
    //         console.warn('Target is not a Group, replacing entire object');
    //         canvas.remove(target);
    //         canvas.add(newGroup);
    //       }

    //       target.set({
    //         scaleX: 1,
    //         scaleY: 1,
    //         width: newWidth,
    //         height: newHeight,
    //       });
    //       canvas.renderAll();
    //     },
    //   );
    // });

    canvas.add(scalableProgressBar);
    canvas.renderAll();
  });
}

export const createText = (text: string) => {
  return new fabric.IText(text, {
    left: 0,
    top: 0,
    fill: '#aabbcc',
    fontFamily: 'Helvetica',
    fontSize: 36,
    fontWeight: '400',
    objectId: uuidv4(),
  } as fabric.ITextOptions);
};

// export const createSpecificShape = (
//   canvas: fabric.Canvas,
//   shapeType: ShapeVariant,
// ) => {
//   if (!canvas) return;
//   let shape: fabric.Object | null = null;

//   switch (shapeType) {
//     case 'progressBar-rounded':
//       shape = createProgressBar('rounded');
//       break;
//     case 'progressBar-sharp':
//       shape = createProgressBar('sharp');
//       break;
//     case 'progressBar-circular':
//       shape = createProgressBar('circular');
//       break;
//     case 'text':
//       shape = createText('Tap to Type');
//       break;
//     default:
//       shape = null;
//   }
//   console.log('shape', shape);

//   if (!shape) return;

//   canvas.add(shape);
//   canvas.setActiveObject(shape);
//   canvas.requestRenderAll();
// };

// export const handleImageUpload = ({
//   file,
//   canvas,
//   shapeRef,
//   syncShapeInStorage,
// }: ImageUpload) => {
//   const reader = new FileReader();

//   reader.onload = () => {
//     fabric.Image.fromURL(reader.result as string, (img) => {
//       img.scaleToWidth(200);
//       img.scaleToHeight(200);

//       canvas.current.add(img);

//       // @ts-ignore
//       img.objectId = uuidv4();

//       shapeRef.current = img;

//       syncShapeInStorage(img);
//       canvas.current.requestRenderAll();
//     });
//   };

//   reader.readAsDataURL(file);
// };

// export const modifyShape = ({
//   canvas,
//   property,
//   value,
//   activeObjectRef,
//   syncShapeInStorage,
// }: ModifyShape) => {
//   const selectedElement = canvas.getActiveObject();

//   if (!selectedElement || selectedElement?.type === "activeSelection") return;

//   // if  property is width or height, set the scale of the selected element
//   if (property === "width") {
//     selectedElement.set("scaleX", 1);
//     selectedElement.set("width", value);
//   } else if (property === "height") {
//     selectedElement.set("scaleY", 1);
//     selectedElement.set("height", value);
//   } else {
//     if (selectedElement[property as keyof object] === value) return;
//     selectedElement.set(property as keyof object, value);
//   }

//   // set selectedElement to activeObjectRef
//   activeObjectRef.current = selectedElement;

//   syncShapeInStorage(selectedElement);
// };

// export const bringElement = ({
//   canvas,
//   direction,
//   syncShapeInStorage,
// }: ElementDirection) => {
//   if (!canvas) return;

//   // get the selected element. If there is no selected element or there are more than one selected element, return
//   const selectedElement = canvas.getActiveObject();

//   if (!selectedElement || selectedElement?.type === "activeSelection") return;

//   // bring the selected element to the front
//   if (direction === "front") {
//     canvas.bringToFront(selectedElement);
//   } else if (direction === "back") {
//     canvas.sendToBack(selectedElement);
//   }

//   // canvas.renderAll();
//   syncShapeInStorage(selectedElement);

//   // re-render all objects on the canvas
// };
