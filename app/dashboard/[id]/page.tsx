import { formatCurrency, formatPercentage } from '@/lib/formatNumbers';
import { CircleDot, CirclePlus, HandCoins } from 'lucide-react';
import { notFound } from 'next/navigation';
import AddTransactionForm from './_components/addTransactionForm';
import ProjectHeader from './_components/header';
import StatusCard from './_components/statusCard';
import TransactionsTable from './_components/transactionsTable';
import { fetchProjectById, fetchTransactionsByProjectId } from './actions';

const page = async ({ params }: { params: { id: string } }) => {
  const { project, error: projectFetchingError } = await fetchProjectById(params.id);

  if (projectFetchingError || !project) {
    console.log(projectFetchingError);
    return notFound();
  }

  const { transactions, error: transactionsFetchingError } = await fetchTransactionsByProjectId(
    project.id,
  );

  if (transactionsFetchingError) {
    console.log(transactionsFetchingError);
    return [];
  }

  const statusCards = [
    {
      title: 'ما تم جمعه حتى الان',
      icon: <HandCoins className='h-5 w-5' />,
      value: formatCurrency(parseFloat(project.progress)),
    },
    {
      title: 'الهدف المراد جمعه',
      icon: <CirclePlus className='h-5 w-5' />,
      value: formatCurrency(parseFloat(project.target_goal)),
    },
    {
      title: 'نسبة الإنجاز',
      icon: <CircleDot className='h-5 w-5' />,
      value: formatPercentage(parseFloat(project.progress) / parseFloat(project.target_goal)),
    },
  ];

  return (
    <section className='container px-5'>
      <ProjectHeader project={project} />
      <section className='py-5 flex flex-wrap items-center justify-between gap-2 md:gap-5'>
        {statusCards.map((card) => (
          <StatusCard key={card.title} title={card.title} icon={card.icon} value={card.value} />
        ))}
      </section>

      <section className='py-5 space-y-5'>
        <AddTransactionForm project={project} />
        <TransactionsTable transactions={transactions} />
      </section>
    </section>
  );
};

export default page;
