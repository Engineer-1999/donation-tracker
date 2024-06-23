'use client';

import { supabaseClient } from '@/lib/supabase/client';
import ColorThief from 'colorthief';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import ChangeImageButton from './changeImageButton';
import ImageInput from './imageInput';

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

    setDominantColors(
      palette.map((color) => `rgb(${color[0]}, ${color[1]}, ${color[2]})`),
    );
  };

  const updateColor = async (color: string) => {
    const oldColor = projectColor;
    setProjectColor(color);

    const { error } = await supabaseClient
      .from('projects')
      .update({ color })
      .match({ id });

    if (error) {
      setProjectColor(oldColor);
      console.log(error);
      return;
    }

    router.refresh();
  };

  console.log(dominantColors);

  return (
    <section className=''>
      <h4 className='font-semibold text-gray-800 mb-3 flex items-center justify-between'>
        صورة الإعلان:
        {hasAnImage && (
          <ChangeImageButton
            id={id}
            setImageUrl={setImageUrl}
            setIsLoading={setIsLoading}
          />
        )}
      </h4>
      {hasAnImage ? (
        <div>
          <div className='p-2 bg-gray-100 rounded-lg flex items-center justify-center'>
            <div className='relative w-fit h-fit'>
              <Image
                ref={image}
                src={imageUrl}
                alt={name}
                width={200}
                height={200}
                className='rounded-lg'
                onLoad={extractColors}
              />
              {/* overlay */}
              <div
                className='absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300'
                style={{ opacity: isLoading ? 1 : 0 }}
              />
              <div
                className='absolute inset-0 z-10 flex items-center justify-center'
                style={{ opacity: isLoading ? 1 : 0 }}
              >
                <Loader2 className='text-white animate-spin w-7 h-7' />
              </div>
            </div>
          </div>
          <div className='flex items-center justify-center gap-3 py-3 overflow-hidden'>
            {dominantColors.map((color, index) => (
              <AnimatePresence key={index} mode='wait'>
                <motion.button
                  key={index + color}
                  initial={{ y: -60, scale: 0.5, transformOrigin: 'center' }}
                  animate={{ y: 0, scale: 1 }}
                  exit={{ y: 60, scale: 0.5 }}
                  transition={{
                    delay: index * 0.06,
                    type: 'spring',
                    bounce: 0.2,
                  }}
                  className='h-8 md:h-12 w-full rounded-lg bg-white'
                  whileHover={{
                    scale: color === projectColor ? 1 : 1.05,
                    transition: { delay: 0 },
                  }}
                  onClick={() => updateColor(color)}
                  style={{ backgroundColor: color }}
                  disabled={color === projectColor}
                />
              </AnimatePresence>
            ))}
          </div>
        </div>
      ) : (
        <ImageInput
          id={id}
          setImageUrl={setImageUrl}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      )}
    </section>
  );
};

export default ProjectImage;
