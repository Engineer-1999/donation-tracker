import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { getElementByType, hasElement, removeElement } from '@/lib/canvas';
import { createElement } from '@/lib/canvas/elements';
import { formatCurrency, formatPercentage } from '@/lib/formatNumbers';
import { fabric } from 'fabric-pure-browser';
import { Circle, CircleDot, Spline, Square } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useCanvas } from '../../hooks/CanvasContext';
import ControlsSectionWrapper from './wrapper';

interface ProgressBarControlsProps {
  percentage?: number;
  progressAmount?: number;
  totalAmount?: number;
  projectColor?: string;
}

const ProgressBarControls: React.FC<ProgressBarControlsProps> = ({
  percentage = 60,
  progressAmount = 1000,
  totalAmount = 300000,
  projectColor,
}) => {
  const { fabricRef } = useCanvas();
  const canvas = fabricRef.current;

  const [showPercentage, setShowPercentage] = useState(() =>
    hasElement({ canvas, type: 'percentageText' }),
  );
  const [showProgressAmount, setShowProgressAmount] = useState(() =>
    hasElement({ canvas, type: 'progressAmountText' }),
  );
  const [showTotalAmount, setShowTotalAmount] = useState(() =>
    hasElement({ canvas, type: 'totalAmountText' }),
  );

  const progressBarRef = useRef<fabric.Object | null>(null);

  const createProgressBar = useCallback(
    async (shape: 'sharp' | 'circular' | 'rounded') => {
      if (!canvas) return;

      if (progressBarRef.current) {
        canvas.remove(progressBarRef.current);
      }

      try {
        const newProgressBar = await createElement({
          canvas,
          type: 'progressBar',
          options: {
            shape,
            color: projectColor,
            progress: percentage,
            width: 600,
            left: 50,
            top: 50,
          },
        });

        if (newProgressBar) {
          progressBarRef.current = newProgressBar;
          canvas.renderAll();
        }
      } catch (error) {
        console.error('Error creating progress bar:', error);
      }
    },
    [canvas, projectColor, percentage],
  );

  useEffect(() => {
    if (!canvas) return;

    const updateShowStates = () => {
      setShowPercentage(!!hasElement({ canvas, type: 'percentageText' }));
      setShowProgressAmount(!!hasElement({ canvas, type: 'progressAmountText' }));
      setShowTotalAmount(!!hasElement({ canvas, type: 'totalAmountText' }));
    };

    canvas.on('object:added', updateShowStates);
    canvas.on('object:removed', updateShowStates);

    return () => {
      canvas.off('object:added', updateShowStates);
      canvas.off('object:removed', updateShowStates);
    };
  }, [canvas]);

  const createOrUpdateTextElement = useCallback(
    (type: string, text: string, show: boolean) => {
      if (!canvas) return;

      const existingElement = getElementByType({ canvas, type });
      if (show) {
        if (existingElement) {
          (existingElement as fabric.Text).set('text', text);
          canvas.renderAll();
        } else {
          createElement({
            canvas,
            type: 'text',
            options: {
              text,
              left: 50,
              top: 50,
              fontSize: 32,
              fontWeight: 'bold',
              fill: projectColor,
              data: { type },
            },
          });
        }
      } else {
        removeElement({ canvas, type });
      }
    },
    [canvas, projectColor],
  );

  useEffect(() => {
    createOrUpdateTextElement('percentageText', formatPercentage(percentage / 100), showPercentage);
  }, [canvas, percentage, projectColor, showPercentage, createOrUpdateTextElement]);

  useEffect(() => {
    createOrUpdateTextElement(
      'progressAmountText',
      formatCurrency(progressAmount),
      showProgressAmount,
    );
  }, [canvas, progressAmount, projectColor, showProgressAmount, createOrUpdateTextElement]);

  useEffect(() => {
    createOrUpdateTextElement('totalAmountText', formatCurrency(totalAmount), showTotalAmount);
  }, [canvas, totalAmount, projectColor, showTotalAmount, createOrUpdateTextElement]);

  return (
    <ControlsSectionWrapper title='إعدادات شريط التقدم' icon={<CircleDot className='w-4 h-4' />}>
      <div className='grid grid-cols-3 items-center gap-2 mb-2'>
        <Button variant='outline' className='w-full' onClick={() => createProgressBar('sharp')}>
          <Square className='w-6 h-6' />
        </Button>
        <Button variant='outline' className='w-full' onClick={() => createProgressBar('circular')}>
          <Circle className='w-6 h-6' />
        </Button>
        <Button variant='outline' className='w-full' onClick={() => createProgressBar('rounded')}>
          <Spline className='w-6 h-6' />
        </Button>
      </div>
      <div className='flex items-center justify-between gap-2 py-2'>
        <span className='text-sm'>إظهار نسبة التقدم</span>
        <Switch onCheckedChange={setShowPercentage} checked={showPercentage} />
      </div>
      <div className='flex items-center justify-between gap-2 py-2'>
        <span className='text-sm'>إظهار المبلغ المجموع</span>
        <Switch onCheckedChange={setShowProgressAmount} checked={showProgressAmount} />
      </div>
      <div className='flex items-center justify-between gap-2 py-2'>
        <span className='text-sm'>إظهار كامل المبلغ المستهدف</span>
        <Switch onCheckedChange={setShowTotalAmount} checked={showTotalAmount} />
      </div>
    </ControlsSectionWrapper>
  );
};

export default ProgressBarControls;
