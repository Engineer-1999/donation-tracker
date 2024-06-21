import { createClerkSupabaseServerClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import AddTransactionForm from './transactions/addTransactionForm';
import TransactionsTable from './transactions/transactionsTable';
import ProjectImage from './projectImage';
import ProjectHeader from './header';
import StatusCard from './statusCard';
import { formatCurrency, formatPercentage } from '@/utils/formatNumbers';
import { CircleDot, CirclePlus, HandCoins } from 'lucide-react';
import ProjectColor from './projectColor';
import { fetchProjectById, fetchTransactionsByProjectId } from './actions';

const page = async ({ params }: { params: { id: string } }) => {
  const { project, error: projectFetchingError } = await fetchProjectById(
    params.id,
  );

  if (projectFetchingError) {
    console.log(projectFetchingError);
    return notFound();
  }

  const { transactions, error: transactionsFetchingError } =
    await fetchTransactionsByProjectId(project.id);

  if (transactionsFetchingError) {
    console.log(transactionsFetchingError);
    return [];
  }

  const statusCards = [
    {
      title: 'ما تم جمعه حتى الان',
      icon: <HandCoins className='h-5 w-5' />,
      value: formatCurrency(project.progress),
    },
    {
      title: 'الهدف المراد جمعه',
      icon: <CirclePlus className='h-5 w-5' />,
      value: formatCurrency(project.target_goal),
    },
    {
      title: 'نسبة الإنجاز',
      icon: <CircleDot className='h-5 w-5' />,
      value: formatPercentage(project.progress / project.target_goal),
    },
  ];

  console.log(project);

  return (
    <section className='container'>
      <ProjectHeader project={project} />
      <section className='py-5 flex items-center justify-between gap-5'>
        {statusCards.map((card) => (
          <StatusCard
            key={card.title}
            title={card.title}
            icon={card.icon}
            value={card.value}
          />
        ))}
      </section>

      <section className=' grid grid-cols-1 md:grid-cols-2 gap-8'>
        <section className='py-5'>
          <section className='space-y-5'>
            <AddTransactionForm project={project} />
            {/* @ts-expect-error Server Component */}
            <TransactionsTable transactions={transactions} />
          </section>
        </section>
        <section className='py-5 space-y-5'>
          <ProjectImage
            id={project.id}
            name={project.name}
            image_url={project.image_url}
          />
          <ProjectColor id={project.id} projectColor={project.color} />
        </section>
      </section>
    </section>
  );
};

export default page;
