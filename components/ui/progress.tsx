'use client';

import * as ProgressPrimitive from '@radix-ui/react-progress';
import * as React from 'react';

import { formatPercentage } from '@/lib/formatNumbers';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  target: number;
  value: number;
  color?: string;
  showPercentage?: boolean;
  indicatorClassName?: string;
  shape?: 'circle' | 'square' | 'rounded';
  padding?: number;
  size?: number;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(
  (
    {
      className,
      value,
      target,
      color = '#000',
      showPercentage = false,
      shape = 'rounded',
      padding = 0,
      indicatorClassName,
      size = 100,
      ...props
    },
    ref,
  ) => {
    const progress = (value / target) * 100;

    return (
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          'relative h-10 w-full mx-auto overflow-hidden border border-gray-200 bg-gray-50',
          { 'rounded-full': shape === 'circle' },
          { 'rounded-lg md:rounded-xl': shape === 'rounded' },
          { 'rounded-none': shape === 'square' },
          className,
        )}
        style={{
          borderWidth: padding ? `${padding}px` : undefined,
          width: `${size}px`,
        }}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            'h-full w-full flex-1 transition-all',
            { 'rounded-full': shape === 'circle' },
            { 'rounded-lg': shape === 'rounded' },
            { 'rounded-none': shape === 'square' },
            indicatorClassName,
          )}
          style={{
            transform: `translateX(${100 - Math.min(progress, 100)}%)`,
            backgroundColor: color,
          }}
        />
        {showPercentage && (
          <>
            {progress === 0 ? (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className='absolute text-sm right-3 top-1/2 -translate-y-1/2 font-medium'
                style={{ color: progress > 90 ? '#fff' : color }}
              >
                لا توجد تبرعات بعد
              </motion.span>
            ) : (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className='absolute left-5 top-1/2 -translate-y-1/2 font-bold'
                style={{ color: progress > 90 ? '#fff' : color }}
              >
                {formatPercentage(value / target, 'en-US')}
              </motion.span>
            )}
          </>
        )}
      </ProgressPrimitive.Root>
    );
  },
);
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
