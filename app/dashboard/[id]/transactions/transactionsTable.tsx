import React from 'react';
import { DataTable } from './dataTable';
import { columns } from './columns';
import { formatCurrency, formatDate } from '@/utils/formatNumbers';
import { Transaction } from '@/utils/supabase/schema';

const transformData = (transactions: Transaction[]) => {
  return transactions.map((transaction) => ({
    ...transaction,
    date: formatDate(transaction.created_at),
    amount: formatCurrency(parseFloat(transaction.amount)),
  }));
};

const TransactionsTable = async ({
  transactions,
}: {
  transactions: Transaction[];
}) => {
  const data = transformData(transactions);
  return <DataTable columns={columns} data={data} />;
};

export default TransactionsTable;
