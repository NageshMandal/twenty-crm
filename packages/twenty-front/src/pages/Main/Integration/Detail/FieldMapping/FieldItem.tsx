import React from "react";

import Icon from "src/components/base/Icon";

type Props = {
  label: string;
};

const FieldItem: React.FC<Props> = ({ label }) => {
  return (
    <div className='flex items-center justify-between col-span-5 py-8 pr-10 border rounded-lg pl-50 text-neutral-800 dark:text-neutral-300 bg-contentColor dark:bg-contentColor-dark border-borderColor dark:border-borderColor-dark'>
      <p>
        {label} <span className='pl-2 text-neutral-700 dark:text-neutral-400'>(text)</span>
      </p>
      <Icon name='Sharp' className='w-20 h-18' />
    </div>
  );
};

export default FieldItem;
