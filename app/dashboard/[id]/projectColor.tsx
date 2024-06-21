'use client';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useState } from 'react';
import { HexColorInput, HexColorPicker } from 'react-colorful';
import { useClickAway, useDebounce } from '@uidotdev/usehooks';
import { supabaseClient } from '@/utils/supabase/client';

type ProjectColorProps = {
  id: string;
  projectColor: string;
};

const ProjectColor = ({ id, projectColor }: ProjectColorProps) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [color, setColor] = useState(projectColor);
  const debouncedColor = useDebounce(color, 500);

  const ref = useClickAway<HTMLDivElement>(() => {
    setShowColorPicker(false);
  });

  const handleColorChange = async (color: string) => {
    setColor(color);
    const { error } = await supabaseClient
      .from('projects')
      .update({
        color,
      })
      .match({ id });

    if (error) {
      console.log(error);
      return;
    }
  };

  return (
    <section>
      <section className='flex items-center justify-between mb-1.5'>
        <h4 className='font-semibold text-gray-800 flex items-center justify-between'>
          لون الشريط في الإعلان:
        </h4>
        <div className='relative'>
          <Button
            variant='outline'
            size='sm'
            className='gap-2 disabled:opacity-100'
            onClick={() => setShowColorPicker(true)}
            disabled={showColorPicker}
          >
            <span
              className='w-4 h-4 rounded-full bg-white'
              style={{
                backgroundColor: color,
              }}
            />
            تغيير اللون
          </Button>
          {showColorPicker && (
            <div ref={ref} className='absolute left-0 top-11 z-50'>
              <div className='border border-gray-200 rounded-lg p-1 mb-4 w-fit relative text-gray-700 bg-white'>
                <HexColorPicker color={color} onChange={handleColorChange} />
                <HexColorInput
                  color={color}
                  onChange={handleColorChange}
                  dir='ltr'
                  className='w-full pl-6 p-2 mt-1 focus:ring-0 focus:outline-none bg-gray-100 rounded'
                />
                <span className='absolute bottom-3 left-4'>#</span>
              </div>
            </div>
          )}
        </div>
      </section>
      <Progress color={color} value={60} target={100} />
    </section>
  );
};

export default ProjectColor;
