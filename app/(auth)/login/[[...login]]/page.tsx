'use client';

import { Button } from '@/components/ui/button';
import { useSignIn } from '@clerk/nextjs';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { generateErrorMessage } from '@/lib/errorCodes';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const loginSchema = z.object({
  email: z.string().min(1, 'ادخل بريدك الالكتروني').email('هذا البريد غير صالح'),
  password: z.string().min(1, 'ادخل كلمة المرور'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: LoginFormData) {
    if (!isLoaded) return;

    setLoading(true);
    setError('');

    try {
      const signInAttempt = await signIn.create({
        identifier: values.email,
        password: values.password,
      });

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        router.push('/dashboard');
      } else {
        console.log('signInAttempt', signInAttempt);
      }
    } catch (error: any) {
      const code = error?.errors?.[0]?.code ?? 'unknown_error';
      setError(generateErrorMessage(code));
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1 className='text-2xl font-bold mb-4'>تسجيل الدخول</h1>
      <p className='text-sm text-gray-500'>
        الدخول إلى منصة سخاء يتيح لك بدء حملات تبرعات وتحديث نسبة الإنجاز تلقائيًا.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='mt-10 space-y-4'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    dir='ltr'
                    onFocus={() => setError('')}
                    placeholder='name@example.com'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    dir='ltr'
                    type='password'
                    onFocus={() => setError('')}
                    placeholder='Password'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {error && <p className='text-sm text-red-500'>{error}</p>}
          <Button type='submit' className='w-full' disabled={loading}>
            {loading ? '...جاري الدخول' : 'تسجيل الدخول'}
          </Button>
          <p className='text-sm text-gray-500'>
            ليس لديك حساب؟{' '}
            <Link href='/register' className='underline underline-offset-2'>
              أنشاء حساب جديد
            </Link>
          </p>
        </form>
      </Form>
    </>
  );
};

export default LoginPage;
