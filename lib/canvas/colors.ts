import ColorThief from 'colorthief';

export const extractColors = (image: HTMLImageElement) => {
  const colorThief = new ColorThief();
  const palette = colorThief.getPalette(image, 12);

  if (!palette) {
    console.error('No dominant colors found');
    return;
  }

  return palette.map((color) => `rgb(${color[0]}, ${color[1]}, ${color[2]})`);
};
