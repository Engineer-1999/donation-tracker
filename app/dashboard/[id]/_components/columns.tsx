'use client';

import { Transaction } from '@/lib/supabase/schema';
import { ColumnDef } from '@tanstack/react-table';
import DeleteTransactionButton from './deleteTransactionButton';

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: 'name',
    header: 'اسم المتبرع',
  },
  {
    accessorKey: 'date',
    header: 'التاريخ',
  },
  {
    accessorKey: 'amount',
    header: 'مبلغ التبرع',
  },
  {
    accessorKey: 'id',
    header: '',
    cell: ({ getValue }) => {
      const id = getValue() as string;
      return <DeleteTransactionButton id={id} />;
    },
  },
];
