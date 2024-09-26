import React from 'react';

type WrapperProps = {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
};

const ControlsSectionWrapper = ({ title, icon, children }: WrapperProps) => {
  return (
    <div className='px-3'>
      <h4 className='flex items-center text-sm font-semibold text-gray-800 gap-2 mb-4'>
        {icon}
        {title}
      </h4>
      <div>{children}</div>
    </div>
  );
};

export default ControlsSectionWrapper;
