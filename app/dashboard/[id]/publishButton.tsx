'use client';

import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const PUBLISHED_TEXT = 'هذا المشروع منشور';
const UNPUBLISHED_TEXT = 'هذا المشروع غير منشور';

type PublishButtonProps = {
  isPublishedProject: boolean;
  onPublishChange: (value: boolean) => void;
};

const PublishButton = ({
  isPublishedProject,
  onPublishChange,
}: PublishButtonProps) => {
  const [isPublished, setIsPublished] = useState(isPublishedProject);

  const handlePublishChange = (value: boolean) => {
    setIsPublished(value);
    onPublishChange(value);
  };

  return (
    <div
      className={cn('flex items-center gap-3 p-2 pr-3 rounded-full border', {
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
  );
};

export default PublishButton;
