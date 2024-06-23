import Logo from '@/components/ui/logo';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className='relative flex flex-col items-center h-screen bg-primary-50 px-4'>
      <div className='flex flex-col items-center justify-center py-10'>
        <Logo className='w-28 h-28 md:w-32 md:h-32' />
      </div>
      <section className='w-full max-w-screen-sm border border-gray-200 rounded-xl p-3 md:p-7 text-center bg-white'>
        {children}
      </section>
    </main>
  );
};

export default AuthLayout;
