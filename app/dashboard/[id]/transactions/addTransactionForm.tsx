'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { fixNumbers } from '@/utils/formatNumbers';
import { supabaseClient } from '@/utils/supabase/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Project } from '@/utils/supabase/schema';
import { useRouter } from 'next/navigation';

const addTransactionSchema = z.object({
  donatorName: z.string().min(1, 'اسم المتبرع'),
  donationAmount: z.string().refine((val) => {
    const parsed = parseFloat(val);
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
      donationAmount: '0',
    },
  });

  const handleAnanName = () => {
    form.setValue('donatorName', 'فاعل خير');
  };

  const onSubmit = async (values: AddTransactionFormData) => {
    const { error: updateTransactionError } = await supabaseClient
      .from('transactions')
      .insert([
        {
          project_id: project.id,
          name: values.donatorName,
          amount: fixNumbers(values.donationAmount),
        },
      ]);

    if (updateTransactionError) {
      console.log(updateTransactionError);
    }

    const { error: updateProgressValueError } = await supabaseClient
      .from('projects')
      .update({
        progress: project.progress + parseFloat(values.donationAmount),
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
        className='flex items-center justify-between gap-4 w-full'
      >
        <FormField
          control={form.control}
          name='donatorName'
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormControl>
                <div className='relative'>
                  <Input
                    type='text'
                    dir='rtl'
                    placeholder='اسم المتبرع'
                    {...field}
                  />
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
            <FormItem>
              <FormControl>
                <Input
                  type='text'
                  dir='rtl'
                  placeholder='مبلغ التبرع'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' className='min-w-32 gap-2'>
          <PlusIcon className='h-4 w-4' />
          إضافة تبرع
        </Button>
      </form>
    </Form>
  );
};

export default AddTransactionForm;
