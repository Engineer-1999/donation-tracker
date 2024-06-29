import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { generateErrorMessage } from '@/lib/errorCodes';
import { useUser } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const userDetailsSchema = z.object({
  firstName: z.string().min(1, 'أدخل اسمك الأول'),
  lastName: z.string().min(1, 'أدخل اسمك الأخير'),
  photo: z.optional(z.string()),
});

type UserDetailsFormData = z.infer<typeof userDetailsSchema>;

const UserDetailsForm = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const form = useForm<UserDetailsFormData>({
    resolver: zodResolver(userDetailsSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      photo: '',
    },
  });

  async function onSubmit(values: UserDetailsFormData) {
    if (!isLoaded || !user) return;
    setLoading(true);

    try {
      await user?.update({
        firstName: values.firstName,
        lastName: values.lastName,
      });
      router.push('/dashboard');
    } catch (error: any) {
      setError(generateErrorMessage(error.errors[0].code));
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='mt-10 space-y-4'>
        <FormField
          control={form.control}
          name='firstName'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  onFocus={() => setError('')}
                  placeholder='اسمك الأول'
                  {...field}
                />
              </FormControl>
              <FormMessage />
              {error && <FormMessage>{error}</FormMessage>}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='lastName'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  onFocus={() => setError('')}
                  placeholder='اسمك الأخير'
                  {...field}
                />
              </FormControl>
              <FormMessage />
              {error && <FormMessage>{error}</FormMessage>}
            </FormItem>
          )}
        />
        <Button
          type='submit'
          className='w-full'
          disabled={loading}
          isLoading={loading}
        >
          إكمال التسجيل
        </Button>
      </form>
    </Form>
  );
};

export default UserDetailsForm;
