import React from "react";

type Props = {
  label: string;
  percent: number;
};

const ProcessBar: React.FC<Props> = ({ label, percent }) => {
  return (
    <div className='flex flex-col'>
      <p className='px-6 text-12 text-neutral-800 dark:text-neutral-200 whitespace-nowrap'>
        {label}
      </p>
      <div className='relative flex items-center justify-between p-4 bg-gray-200 rounded-full dark:bg-borderColor-dark desktop:min-ww-300 min-w-200 w-full'>
        <div
          className={`h-full px-6 py-4 rounded-full bg-primary/60`}
          style={{ width: `${percent}%` }}
        >
          <p className='text-12 text-neutral-800 dark:text-neutral-200 whitespace-nowrap'>
            {percent}%
          </p>
        </div>
        <div className='absolute flex justify-end w-full px-10'>
          <p className='px-6 py-2 text-12 text-neutral-700 dark:text-neutral-200'>
            {100 - percent}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProcessBar;
