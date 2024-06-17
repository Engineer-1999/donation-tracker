import Link from 'next/link';

type Project = {
  name: string;
  createdAt: string;
  id: string;
};

const ProjectCard = ({ id, name, createdAt }: Project) => {
  const pretyDate = new Date(createdAt).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <section className='rounded-lg bg-primary-50 border border-primary-100 overflow-hidden'>
      <Link
        href={`/dashboard/${id}`}
        className='block text-lg border-b border-primary-100 p-3 font-semibold text-white bg-primary-500'
      >
        {name}
      </Link>
      <div className='text-sm text-gray-500 p-3'>{pretyDate}</div>
    </section>
  );
};

export default ProjectCard;
