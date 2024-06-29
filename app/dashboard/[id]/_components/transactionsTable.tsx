import { formatCurrency, formatDate } from '@/lib/formatNumbers';
import { Transaction } from '@/lib/supabase/schema';
import { columns } from './columns';
import { DataTable } from './dataTable';

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
  transactions: Transaction[] | null;
}) => {
  if (!transactions) {
    return null;
  }

  const data = transformData(transactions);
  return <DataTable columns={columns} data={data} />;
};

export default TransactionsTable;
