'use client';

import * as ProgressPrimitive from '@radix-ui/react-progress';
import * as React from 'react';

import { formatPercentage } from '@/lib/formatNumbers';
import { cn } from '@/lib/utils';

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  target: number;
  value: number;
  color?: string;
  showPercentage?: boolean;
  indicatorClassName?: string;
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
      indicatorClassName,
      ...props
    },
    ref,
  ) => {
    const progress = (value / target) * 100;

    return (
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          'relative h-10 w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50',
          className,
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            'h-full w-full flex-1 transition-all',
            indicatorClassName,
          )}
          style={{
            transform: `translateX(${100 - progress}%)`,
            backgroundColor: color,
          }}
        />
        {showPercentage && (
          <>
            {progress === 0 ? (
              <span
                className='absolute text-sm right-3 top-1/2 -translate-y-1/2 font-medium'
                style={{ color: progress > 90 ? '#fff' : color }}
              >
                لا توجد تبرعات بعد
              </span>
            ) : (
              <span
                className='absolute left-5 top-1/2 -translate-y-1/2 font-bold'
                style={{ color: progress > 90 ? '#fff' : color }}
              >
                {formatPercentage(value / target, 'en-US')}
              </span>
            )}
          </>
        )}
      </ProgressPrimitive.Root>
    );
  },
);
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
