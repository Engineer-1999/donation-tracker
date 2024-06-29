import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { supabaseClient } from '@/lib/supabase/client';
import { Project, Transaction } from '@/lib/supabase/schema';
import { XIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

type DeleteTransactionButtonProps = {
  id: string;
};

const DeleteTransactionButton = ({ id }: DeleteTransactionButtonProps) => {
  const router = useRouter();

  const deleteTransaction = async (id: string) => {
    const { data: transaction } = await supabaseClient
      .from('transactions')
      .select()
      .eq('id', id)
      .returns<Transaction[]>()
      .single();

    if (!transaction) {
      return;
    }

    const { data: project } = await supabaseClient
      .from('projects')
      .select()
      .eq('id', transaction.project_id)
      .returns<Project[]>()
      .single();

    if (!project) {
      return;
    }

    const { error } = await supabaseClient
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) {
      console.log(error);
    }

    const { error: updateProgressValueError } = await supabaseClient
      .from('projects')
      .update({
        progress: parseFloat(project.progress) - parseFloat(transaction.amount),
      })
      .match({ id: project.id });

    if (updateProgressValueError) {
      console.log(updateProgressValueError);
    }

    router.refresh();
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant='destructive'
          size='icon'
          className='h-7 w-7 text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100'
        >
          <XIcon className='h-4 w-4' />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>هل انت متأكد من رغبتك في حذف هذا التبرع؟</DrawerTitle>
          <DrawerDescription>
            لا يمكن استرجاع هذا التبرع بعد حذفه
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose>
            <Button
              onClick={async () => {
                await deleteTransaction(id);
                router.refresh();
              }}
              variant='destructive'
            >
              تاكيد الحذف
            </Button>
          </DrawerClose>
          <DrawerClose>
            <Button variant='outline'>الغاء</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default DeleteTransactionButton;
