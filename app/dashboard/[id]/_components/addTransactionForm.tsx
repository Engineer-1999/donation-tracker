'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { fixNumbers } from '@/lib/formatNumbers';
import { supabaseClient } from '@/lib/supabase/client';
import { Project } from '@/lib/supabase/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const addTransactionSchema = z.object({
  donatorName: z.string().min(1, 'اسم المتبرع'),
  donationAmount: z.string().refine((val) => {
    const parsed = parseFloat(fixNumbers(val));
    return !isNaN(parsed) && isFinite(parsed) && parsed > 0;
  }, 'ادخل مبلغا صحيحا'),
});

type AddTransactionFormData = z.infer<typeof addTransactionSchema>;

const AddTransactionForm = ({ project }: { project: Project }) => {
  const router = useRouter();

  const form = useForm<AddTransactionFormData>({
    resolver: zodResolver(addTransactionSchema),
    defaultValues: {
      donatorName: '',
      donationAmount: '',
    },
  });

  const handleAnanName = (e: React.MouseEvent) => {
    e.preventDefault();
    form.setValue('donatorName', 'فاعل خير');
    form.setFocus('donationAmount');
  };

  const onSubmit = async (values: AddTransactionFormData) => {
    const transformedDonationAmount = parseFloat(fixNumbers(values.donationAmount));

    const { error: updateTransactionError } = await supabaseClient.from('transactions').insert([
      {
        project_id: project.id,
        name: values.donatorName,
        amount: transformedDonationAmount,
      },
    ]);

    if (updateTransactionError) {
      console.log(updateTransactionError);
    }

    const { error: updateProgressValueError } = await supabaseClient
      .from('projects')
      .update({
        progress: project.progress + transformedDonationAmount,
      })
      .match({ id: project.id });

    if (updateProgressValueError) {
      console.log(updateProgressValueError);
    }

    router.refresh();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4 w-full'
      >
        <FormField
          control={form.control}
          name='donatorName'
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormControl>
                <div className='relative'>
                  <Input type='text' dir='rtl' placeholder='اسم المتبرع' {...field} />
                  <Button
                    size='sm'
                    variant='secondary'
                    className='absolute left-1 top-1/2 -translate-y-1/2'
                    onClick={handleAnanName}
                  >
                    فاعل خير
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='donationAmount'
          render={({ field }) => (
            <FormItem className='w-full md:w-auto'>
              <FormControl>
                <Input type='text' dir='rtl' placeholder='مبلغ التبرع' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type='submit'
          className='min-w-32 gap-2 w-full md:w-auto'
          style={{ backgroundColor: project.color }}
        >
          <PlusIcon className='h-4 w-4' />
          إضافة تبرع
        </Button>
      </form>
    </Form>
  );
};

export default AddTransactionForm;
