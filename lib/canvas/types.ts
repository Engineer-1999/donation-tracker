export type CustomFabricObject<T extends fabric.Object> = T & {
  objectId?: string;
};

export type CanvasMouseMove = {
  options: fabric.IEvent;
  canvas: fabric.Canvas;
  selectedShapeRef: any;
  shapeRef: any;
};

export type ProgressBarVariant = 'rounded' | 'sharp' | 'circular';
export type ShapeVariant =
  | 'progressBar-rounded'
  | 'progressBar-sharp'
  | 'progressBar-circular'
  | 'text';
