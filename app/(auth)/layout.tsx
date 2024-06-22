import Logo from '@/components/ui/logo';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className='relative flex flex-col items-center justify-center gap-16 h-screen bg-primary-50 px-4'>
      <Logo className='absolute top-16 md:top-28 mx-auto w-28 h-28 md:w-32 md:h-32' />
      <section className='w-full max-w-screen-sm border border-gray-200 rounded-xl p-3 md:p-7 text-center bg-white'>
        {children}
      </section>
    </main>
  );
};

export default AuthLayout;
