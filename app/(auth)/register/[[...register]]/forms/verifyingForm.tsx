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
import { useSignUp } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const verifyingSchema = z.object({
  code: z.string().min(1, 'ادخل الرمز المروري'),
});

type VerifyingFormData = z.infer<typeof verifyingSchema>;
type VerifyingFormProps = {
  setActive: ReturnType<typeof useSignUp>['setActive'];
  signUp?: ReturnType<typeof useSignUp>['signUp'];
  isLoaded: boolean;
  verefyinging: boolean;
  setVerefyinging: (verefyinging: boolean) => void;
  setUserDetails: (userDetails: boolean) => void;
};

const VerifyingForm = ({
  setActive,
  signUp,
  isLoaded,
  verefyinging,
  setVerefyinging,
  setUserDetails,
}: VerifyingFormProps) => {
  const [error, setError] = useState<string>();

  const form = useForm<VerifyingFormData>({
    resolver: zodResolver(verifyingSchema),
    defaultValues: {
      code: '',
    },
  });

  async function onSubmit(values: VerifyingFormData) {
    if (!isLoaded) return;

    setVerefyinging(true);

    try {
      const completeSignUp = await signUp?.attemptEmailAddressVerification({
        code: values.code,
      });

      if (completeSignUp?.status === 'complete') {
        if (setActive) {
          await setActive({ session: completeSignUp.createdSessionId });
          setUserDetails(true);
        }
      } else {
        console.log('completeSignUp', completeSignUp);
      }
    } catch (error: any) {
      setError(generateErrorMessage(error.errors[0].code));
      console.log(error);
    } finally {
      setVerefyinging(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='mt-10 space-y-4'>
        <FormField
          control={form.control}
          name='code'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  dir='rtl'
                  onFocus={() => setError('')}
                  placeholder='رمز التاكيد'
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
          disabled={verefyinging}
          isLoading={verefyinging}
        >
          تاكيد الرمز
        </Button>
      </form>
    </Form>
  );
};

export default VerifyingForm;
