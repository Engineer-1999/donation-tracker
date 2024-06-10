import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useSignUp } from '@clerk/nextjs';
import { useState } from 'react';
import { generateErrorMessage } from '@/lib/errorCodes';

const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, 'ادخل بريدك الالكتروني')
      .email('هذا البريد غير صالح'),
    password: z.string().min(1, 'ادخل كلمة المرور'),
    confirmPassword: z.string().min(1, 'ادخل تاكيد كلمة المرور'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'كلمة المرور غير متطابقة',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;
type LoginFormProps = {
  setVerifying: (verifying: boolean) => void;
  signUp?: ReturnType<typeof useSignUp>['signUp'];
  isLoaded: boolean;
  authenticating: boolean;
  setAuthenticating: (authenticating: boolean) => void;
};

const RegisterForm = ({
  setVerifying,
  signUp,
  isLoaded,
  authenticating,
  setAuthenticating,
}: LoginFormProps) => {
  const [error, setError] = useState<string>();
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: RegisterFormData) {
    if (!isLoaded) return;
    setAuthenticating(true);

    try {
      await signUp?.create({
        emailAddress: values.email,
        password: values.password,
      });

      await signUp?.prepareEmailAddressVerification({
        strategy: 'email_code',
      });

      setVerifying(true);
    } catch (error: any) {
      setError(generateErrorMessage(error.errors[0].code));
      console.log(error);
    } finally {
      setAuthenticating(false);
    }
  }

  return (
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
                  onFocus={() => setError('')}
                  type='password'
                  placeholder='Password'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='confirmPassword'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  dir='ltr'
                  onFocus={() => setError('')}
                  type='password'
                  placeholder='Password Confirmation'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && <FormMessage>{error}</FormMessage>}
        <Button
          type='submit'
          className='w-full'
          disabled={authenticating}
          isLoading={authenticating}
        >
          إنشاء حساب
        </Button>
        <p className='text-sm text-gray-500'>
          لديك حساب بالفعل؟{' '}
          <Link href='/login' className='underline underline-offset-2'>
            تسجيل الدخول
          </Link>
        </p>
      </form>
    </Form>
  );
};

export default RegisterForm;
