import { updateColor } from '@/lib/canvas';
import { supabaseClient } from '@/lib/supabase/client';
import { useClickAway } from '@uidotdev/usehooks';
import { motion } from 'framer-motion';
import { Palette } from 'lucide-react';
import { useState } from 'react';
import { HexColorInput, HexColorPicker } from 'react-colorful';
import { useCanvas } from '../../hooks/CanvasContext';
import ControlsSectionWrapper from './wrapper';

type ColorControlsProps = {
  dominantColors: string[];
  projectColor: string;
  setProjectColor: (color: string) => void;
  projectId: string;
  createProgressBar: (shape: 'sharp' | 'circular' | 'rounded', color: string) => void;
};
const ColorControls = ({
  dominantColors,
  projectColor,
  setProjectColor,
  projectId,
  createProgressBar,
}: ColorControlsProps) => {
  const [showColorPicker, setShowColorPicker] = useState(false);

  const { fabricRef } = useCanvas();

  const ref = useClickAway<HTMLDivElement>(() => {
    setShowColorPicker(false);
  });

  const handleColorChange = async (color: string) => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    setProjectColor(color);
    updateColor({ canvas, color });

    const currentProgressBarShape = canvas
      .getObjects()
      .find((obj) => obj.data.type === 'progressBar')?.data.shape;

    createProgressBar(currentProgressBarShape, color);
    await supabaseClient
      .from('projects')
      .update({
        color: color,
      })
      .match({ id: projectId });
  };

  return (
    <ControlsSectionWrapper title='إعدادات الالوان' icon={<Palette className='w-4 h-4' />}>
      <div className='relative'>
        <div className='grid grid-cols-6 items-center gap-2'>
          <button
            className='col-span-6 disabled:opacity-100 w-full h-12 rounded-xl overflow-hidden p-1 border border-neutral-200'
            onClick={() => setShowColorPicker(true)}
            disabled={showColorPicker}
          >
            <div className='w-full h-full rounded-lg' style={{ backgroundColor: projectColor }} />
          </button>
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
              <HexColorPicker color={projectColor} onChange={handleColorChange} />
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
