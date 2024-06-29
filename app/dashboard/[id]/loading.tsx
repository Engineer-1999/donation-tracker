import { Skeleton } from '@/components/ui/skeleton';

const DashboardProjectPageLoading = () => {
  return (
    <section className='container px-5'>
      <header className='py-5 flex items-center justify-between flex-wrap gap-4'>
        <Skeleton className='w-1/6 h-10 rounded-lg' />
        <Skeleton className='w-1/5 h-10 rounded-lg' />
      </header>
      <section className='py-5 flex flex-wrap items-center justify-between gap-2 md:gap-5'>
        <Skeleton className='flex-1 h-20 rounded-lg' />
        <Skeleton className='flex-1 h-20 rounded-lg' />
        <Skeleton className='flex-1 h-20 rounded-lg' />
      </section>
      <section className=' grid grid-cols-1 md:grid-cols-2 gap-8'>
        <section className='py-5'>
          <Skeleton className='w-full h-96 rounded-lg' />
        </section>
        <section className='py-5'>
          <Skeleton className='w-full h-96 rounded-lg' />
        </section>
      </section>
    </section>
  );
};

export default DashboardProjectPageLoading;
