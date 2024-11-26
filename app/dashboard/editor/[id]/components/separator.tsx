import { cn } from '@/lib/utils';

const Separator = ({ className }: { className?: string }) => {
  return <div className={cn('w-full h-px bg-neutral-200 my-3', className)} />;
};

export default Separator;
