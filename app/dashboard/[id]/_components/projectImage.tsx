'use client';

import { supabaseClient } from '@/lib/supabase/client';
import ColorThief from 'colorthief';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

type ProjectImageProps = {
  name: string;
  image_url: string;
  id: string;
  projectColor: string;
  setProjectColor: React.Dispatch<React.SetStateAction<string>>;
};

const ProjectImage = ({
  id,
  name,
  image_url,
  projectColor,
  setProjectColor,
}: ProjectImageProps) => {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string>(image_url);
  const [isLoading, setIsLoading] = useState(false);
  const [dominantColors, setDominantColors] = useState<string[]>([]);
  const image = useRef<HTMLImageElement>(null);

  const hasAnImage = !!image_url || !!imageUrl;

  const extractColors = async () => {
    const colorThief = new ColorThief();
    const palette = await colorThief.getPalette(image.current, 8);

    if (!palette) {
      console.error('No dominant colors found');
      return;
    }

    setDominantColors(palette.map((color) => `rgb(${color[0]}, ${color[1]}, ${color[2]})`));
  };

  const updateColor = async (color: string) => {
    const oldColor = projectColor;
    setProjectColor(color);

    const { error } = await supabaseClient.from('projects').update({ color }).match({ id });

    if (error) {
      setProjectColor(oldColor);
      console.log(error);
      return;
    }

    router.refresh();
  };

  console.log(dominantColors);

  return <section className=''></section>;
};

export default ProjectImage;
