import { supabaseClient } from '@/lib/supabase/client';
import { useClickAway, useDebounce } from '@uidotdev/usehooks';
import { motion } from 'framer-motion';
import { Palette } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { HexColorInput, HexColorPicker } from 'react-colorful';
import ControlsSectionWrapper from './wrapper';

type ColorControlsProps = {
  projectId: string;
  projectColor: string;
  isColorPicking: boolean;
  setProjectColor: React.Dispatch<React.SetStateAction<string>>;
  setIsColorPicking: React.Dispatch<React.SetStateAction<boolean>>;
  dominantColors: string[];
};

const ColorControls = ({
  projectId,
  projectColor,
  isColorPicking,
  setProjectColor,
  setIsColorPicking,
  dominantColors,
}: ColorControlsProps) => {
  const router = useRouter();
  const [showColorPicker, setShowColorPicker] = useState(false);

  const debouncedColor = useDebounce(projectColor, 500);

  useEffect(() => {
    const updateColorInSupabase = async (color: string) => {
      const { error } = await supabaseClient
        .from('projects')
        .update({ color })
        .match({ id: projectId });

      if (error) {
        console.log(error);
      }
    };

    if (debouncedColor) {
      updateColorInSupabase(debouncedColor);
      router.refresh();
    }
  }, [debouncedColor, projectId, router]);

  const ref = useClickAway<HTMLDivElement>(() => {
    setShowColorPicker(false);
  });

  const handleColorChange = (color: string) => {
    setProjectColor(color);
  };
  return (
    <ControlsSectionWrapper
      title='إعدادات الالوان'
      icon={<Palette className='w-4 h-4' />}
    >
      <div className='relative'>
        <div className='grid grid-cols-6 items-center gap-2'>
          <button
            className='col-span-6 disabled:opacity-100 w-full h-12 rounded-xl overflow-hidden p-1 border border-neutral-200'
            onClick={() => setShowColorPicker(true)}
            disabled={showColorPicker}
          >
            <div
              className='w-full h-full rounded-lg'
              style={{ backgroundColor: projectColor }}
            />
          </button>
          {/* <Button
            variant='outline'
            size='sm'
            className={cn(
              'aspect-square gap-2 disabled:opacity-100 !cursor-pointer',
              {
                'bg-gray-100 text-gray-700': isColorPicking,
              },
            )}
            disabled={showColorPicker}
            onClick={() => setIsColorPicking(!isColorPicking)}
          >
            <Pipette className='w-4 h-4' />
          </Button> */}
          {dominantColors.map((color, index) => (
            <motion.button
              key={index + color}
              className='aspect-square rounded-lg bg-white'
              whileHover={{ scale: 1.05 }}
              onClick={() => handleColorChange(color)}
              style={{ backgroundColor: color }}
              disabled={color === projectColor}
            />
          ))}
        </div>

        {showColorPicker && (
          <div ref={ref} className='absolute right-0 top-11 z-50'>
            <div className='border border-gray-200 rounded-lg p-1 mb-4 w-fit relative text-gray-700 bg-white'>
              <HexColorPicker
                color={projectColor}
                onChange={handleColorChange}
              />
              <HexColorInput
                color={projectColor}
                onChange={handleColorChange}
                dir='ltr'
                className='w-full pl-6 p-2 mt-1 focus:ring-0 focus:outline-none bg-gray-100 rounded'
              />
              <span className='absolute bottom-3 left-4'>#</span>
            </div>
          </div>
        )}
      </div>
    </ControlsSectionWrapper>
  );
};

export default ColorControls;
