type StatusCardProps = {
  title: string;
  icon?: React.ReactNode;
  value: string;
};

const StatusCard = ({ title, icon, value }: StatusCardProps) => {
  return (
    <div className='flex flex-1 items-center justify-between gap-8 p-6 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200'>
      <p className='flex items-center gap-2 text-lg font-semibold text-primary-500 dark:text-gray-100 whitespace-nowrap'>
        <span>{icon}</span>
        {title}
      </p>
      <p className='text-lg font-semibold text-gray-600 dark:text-gray-100'>
        {value}
      </p>
    </div>
  );
};

export default StatusCard;
