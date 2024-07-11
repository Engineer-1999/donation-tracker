'use client';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Clipboard, Link as LinkIcon, Settings2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

const PUBLISHED_TEXT = 'ايقاف نشر المشروع';
const UNPUBLISHED_TEXT = 'نشر المشروع';

type ProjectContorlsProps = {
  isPublishedProject: boolean;
  onPublishChange: (value: boolean) => void;
  hasAnImage?: boolean;
  id: string;
};

const ProjectContorls = ({
  isPublishedProject,
  onPublishChange,
  hasAnImage = true,
  id,
}: ProjectContorlsProps) => {
  const [isPublished, setIsPublished] = useState(isPublishedProject);

  let projectUrl = '';
  let visoualEditorUrl = '';
  if (typeof window !== 'undefined') {
    projectUrl = `${window.location.origin}/project/${id}`;
    visoualEditorUrl = `${window.location.origin}/dashboard/editor/${id}`;
  }

  const handlePublishChange = (value: boolean) => {
    if (!hasAnImage) {
      toast.error('يجب إضافة صورة للمشروع قبل نشر هذا المشروع');
      return;
    }

    setIsPublished(value);
    onPublishChange(value);
  };

  const copyProjectUrlToClipboard = () => {
    navigator.clipboard.writeText(projectUrl);
    toast.success('تم نسخ رابط المشروع إلى الحافظة');
  };

  const openProjectPage = () => {
    window.open(projectUrl, '_blank');
  };

  return (
    <div className='flex items-center gap-2'>
      <AnimatePresence initial={false}>
        <div className='flex items-center gap-2'>
          <Link href={visoualEditorUrl}>
            <Button
              size='icon'
              variant='secondary'
              className='border border-primary-100 h-[41px] w-[41px]'
            >
              <Settings2 className='w-4 h-4' />
            </Button>
          </Link>
          <Button
            size='icon'
            variant='secondary'
            className='border border-primary-100 h-[41px] w-[41px]'
            onClick={openProjectPage}
          >
            <LinkIcon className='w-4 h-4' />
          </Button>
          <Button
            size='icon'
            variant='secondary'
            className='border border-primary-100 h-[41px] w-[41px]'
            onClick={copyProjectUrlToClipboard}
          >
            <Clipboard className='w-4 h-4' />
          </Button>
        </div>
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

export default ProjectContorls;
