'use client';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { Clipboard, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';
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

  return (
    <div className='flex items-center gap-2'>
      {isPublished && (
        <div className='flex items-center gap-2'>
          <Button
            size='icon'
            variant='secondary'
            className='border border-primary-100 h-[41px] w-[41px]'
            onClick={copyProjectUrlToClipboard}
            asChild
          >
            <Link href={url} target='_blank'>
              <LinkIcon className='w-4 h-4' />
            </Link>
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
      )}
      <div
        className={cn('flex items-center gap-3 p-2 pr-3 rounded-lg border', {
          'bg-primary-50 border-primary-100': isPublished,
          'border-gray-200': !isPublished,
        })}
      >
        <span
          className={cn('text-sm font-medium', {
            'text-primary-500': isPublished,
            'text-gray-500': !isPublished,
          })}
        >
          {isPublished ? PUBLISHED_TEXT : UNPUBLISHED_TEXT}
        </span>
        <Switch checked={isPublished} onCheckedChange={handlePublishChange} />
      </div>
    </div>
  );
};

export default PublishButton;
