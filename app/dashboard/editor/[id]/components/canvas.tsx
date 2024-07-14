import { forwardRef } from 'react';

type CanvasProps = {};

const Canvas = forwardRef<HTMLCanvasElement, CanvasProps>(
  ({ ...props }, ref) => {
    return (
      <>
        <canvas ref={ref} {...props} />
      </>
    );
  },
);

Canvas.displayName = 'Canvas';

export default Canvas;
