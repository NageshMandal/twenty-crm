import React from "react";

import Icon from "../Icon";

type Props = {
  onDelete?: Function;
  list: string[];
};

const TextChipSet: React.FC<Props> = ({ onDelete = () => {}, list }) => (
  <div className='flex flex-wrap gap-4'>
    {list.map((item) => (
      <div
        key={item}
        role='button'
        onClick={() => onDelete(item)}
        className='flex items-center mr-1 border border-blue-200 bg-hoverColor dark:bg-hoverColor-dark dark:border-blue-900/50 rounded-3 w-fit'
      >
        <p className='px-4 py-4 text-13 text-neutral-800 dark:text-neutral-300'>{item}</p>
        <div className='flex items-center justify-center !h-full px-4 cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-900/75 hover:text-blue-400 hover:dark:text-blue-500'>
          <Icon name='Cross' className='w-16 h-16' />
        </div>
      </div>
    ))}
  </div>
);

export default TextChipSet;
