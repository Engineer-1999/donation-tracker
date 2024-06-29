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
import { fixNumbers } from '@/lib/formatNumbers';
import { supabaseClient } from '@/lib/supabase/client';
import { useAuth } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const newProjectSchema = z.object({
  project_name: z.string().min(1, 'ادخل اسم المشروع'),
  target_goal: z
    .string()
    .min(3, 'ادخل المبلغ')
    .refine((value) => !isNaN(Number(fixNumbers(value))), 'ادخل مبلغ صحيح'),
});

type NewProjectFormData = z.infer<typeof newProjectSchema>;

const NewProjectForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { userId } = useAuth();
  const form = useForm<NewProjectFormData>({
    resolver: zodResolver(newProjectSchema),
    defaultValues: {
      project_name: '',
      target_goal: '',
    },
  });

  async function onSubmit(values: NewProjectFormData) {
    setIsLoading(true);
    const { error, data } = await supabaseClient
      .from('projects')
      .insert([
        {
          name: values.project_name,
          target_goal: fixNumbers(values.target_goal),
          user_id: userId,
        },
      ])
      .select('id')
      .single();

    setIsLoading(false);
    if (error) {
      console.error(error);
      return;
    }

    console.log(data);

    router.push(`/dashboard/${data.id}`);
    form.reset();
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='mt-5 space-y-4'>
          <FormField
            control={form.control}
            name='project_name'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder='اسم المشروع' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='target_goal'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder='المبلغ المطلوب (مثال: 200000)'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type='submit'
            className='w-full'
            isLoading={isLoading}
            disabled={isLoading}
          >
            إنشاء المشروع
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default NewProjectForm;
