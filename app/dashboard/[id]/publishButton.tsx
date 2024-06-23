'use client';

import { MotionButton } from '@/components/ui/motionButton';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Clipboard, Link as LinkIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const PUBLISHED_TEXT = 'هذا المشروع منشور';
const UNPUBLISHED_TEXT = 'هذا المشروع غير منشور';

type PublishButtonProps = {
  isPublishedProject: boolean;
  onPublishChange: (value: boolean) => void;
  hasAnImage?: boolean;
  id: string;
};

const PublishButton = ({
  isPublishedProject,
  onPublishChange,
  hasAnImage = true,
  id,
}: PublishButtonProps) => {
  const [isPublished, setIsPublished] = useState(isPublishedProject);
  const url = `${window.location.origin}/project/${id}`;

  const handlePublishChange = (value: boolean) => {
    if (!hasAnImage) {
      toast.error('يجب إضافة صورة للمشروع قبل نشر هذا المشروع');
      return;
    }

    setIsPublished(value);
    onPublishChange(value);
  };

  const copyProjectUrlToClipboard = () => {
    navigator.clipboard.writeText(url);
    toast.success('تم نسخ رابط المشروع إلى الحافظة');
  };

  const openProjectPage = () => {
    window.open(url, '_blank');
  };

  return (
    <div className='flex items-center gap-2'>
      <AnimatePresence>
        {isPublished && (
          <div className='flex items-center gap-2'>
            <MotionButton
              size='icon'
              variant='secondary'
              className='border border-primary-100 h-[41px] w-[41px]'
              onClick={openProjectPage}
              initial={{ x: -20, scale: 0 }}
              animate={{ x: 0, scale: 1 }}
              exit={{
                opacity: 0,
                transition: { delay: 0, duration: 0.2 },
              }}
              transition={{
                delay: 0.1,
              }}
            >
              <LinkIcon className='w-4 h-4' />
            </MotionButton>
            <MotionButton
              size='icon'
              variant='secondary'
              className='border border-primary-100 h-[41px] w-[41px]'
              onClick={copyProjectUrlToClipboard}
              initial={{ x: -20, scale: 0 }}
              exit={{
                opacity: 0,
                transition: { duration: 0.2 },
              }}
              animate={{ x: 0, scale: 1 }}
            >
              <Clipboard className='w-4 h-4' />
            </MotionButton>
          </div>
        )}
      </AnimatePresence>
      <motion.div
        className={cn('flex items-center gap-3 p-2 pr-3 rounded-lg border', {
          'bg-primary-50 border-primary-100': isPublished,
          'border-gray-200': !isPublished,
        })}
      >
        <motion.span
          layoutId='published'
          key={isPublished ? 'published' : 'unpublished'}
          className={cn('text-sm font-medium', {
            'text-primary-500': isPublished,
            'text-gray-500': !isPublished,
          })}
          transition={{ type: 'spring', bounce: 0, duration: 0.2 }}
        >
          {isPublished ? PUBLISHED_TEXT : UNPUBLISHED_TEXT}
        </motion.span>
        <Switch checked={isPublished} onCheckedChange={handlePublishChange} />
      </motion.div>
    </div>
  );
};

export default PublishButton;
