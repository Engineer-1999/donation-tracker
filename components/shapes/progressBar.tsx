import { ProgressBarVariant } from '@/lib/canvas/types';

export type ProgressBarShapeProps = {
  color?: string;
  shape?: ProgressBarVariant;
  progress?: number;
  width?: number;
};

function getShapeClass(shape: ProgressBarVariant, height: number): string {
  switch (shape) {
    case 'circular':
      return `rx="${height / 2}" ry="${height / 2}"`;
    case 'sharp':
      return '';
    case 'rounded':
      return `rx="${height / 4}" ry="${height / 4}"`;
    default:
      return '';
  }
}

export function createProgressBarShapeSVG({
  shape = 'rounded',
  color = '#000',
  progress = 50,
  width = 600,
}: ProgressBarShapeProps): string {
  const height = width / 10;
  const padding = 5;
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;
  const progressWidth = innerWidth * (progress / 100);
  const outerShapeClass = getShapeClass(shape, height);
  const innerShapeClass = getShapeClass(shape, innerHeight);

  return `
    <svg
      width="${width}"
      height="${height}"
      viewBox="0 0 ${width} ${height}"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width="${width}"
        height="${height}"
        fill="white"
        ${outerShapeClass}
      />
      <rect
        width="${progressWidth}"
        height="${innerHeight}"
        x="${width - progressWidth - padding}"
        y="${padding}"
        fill="${color}"
        ${innerShapeClass}
      />
    </svg>
  `;
}
