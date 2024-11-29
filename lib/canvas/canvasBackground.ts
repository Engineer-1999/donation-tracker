import { fabric } from 'fabric-pure-browser';

export const updateCanvasBackground = ({
  canvas,
  imageUrl,
}: {
  canvas: fabric.Canvas;
  imageUrl: string;
}) => {
  if (!canvas) return null;
  const img = fabric.Image.fromURL(
    imageUrl,
    (img) => {
      img.set({
        left: 0,
        top: 0,
      });
      img.scaleToWidth(canvas.getWidth());
      img.scaleToHeight(canvas.getHeight());
      img.data = imageUrl;

      canvas.setBackgroundImage(img, () => canvas.renderAll());
    },
    { crossOrigin: 'anonymous' },
  );

  return img;
};

export const removeCanvasBackground = ({ canvas }: { canvas: fabric.Canvas }) => {
  canvas.setBackgroundImage(null!, () => canvas.renderAll());
};

export const getCanvasBackgroundImage = ({ canvas }: { canvas: fabric.Canvas | null }) => {
  if (!canvas) return null;

  const backgroundImage = canvas.backgroundImage;

  if (!backgroundImage) return null;

  return backgroundImage as fabric.Image;
};
