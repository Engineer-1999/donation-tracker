import { Skeleton } from '@/components/ui/skeleton';

const DashboardLoading = () => {
  return (
    <div className='container p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
      <Skeleton className='w-full h-[160px] rounded-lg' />
      <Skeleton className='w-full h-[160px] rounded-lg' />
      <Skeleton className='w-full h-[160px] rounded-lg' />
      <Skeleton className='w-full h-[160px] rounded-lg' />
    </div>
  );
};

export default DashboardLoading;
