import React from "react";
import { Link } from "react-router-dom";
import { BsQuestionOctagon } from "react-icons/bs";

import { paths } from "src/routes/path";
import Icon from "src/components/base/Icon";

type Props = {
  label?: string;
};

const HeaderTool: React.FC<Props> = ({ label }) => {
  return (
    <div>
      <Link
        to={paths.main.integration.index}
        className='flex items-center gap-4 pb-4 w-fit text-neutral-800 dark:text-neutral-300'
      >
        <Icon name='ArrowLeft' className='w-20 h-20' />
        <p>Integration</p>
      </Link>
      <div className='flex items-center gap-5'>
        <h2 className='font-normal select-none whitespace-nowrap text-25 text-neutral-800 dark:text-neutral-300'>
          {label} Integration
        </h2>
        <BsQuestionOctagon className='w-28 h-28 text-neutral-800 dark:text-neutral-300' />
      </div>
    </div>
  );
};

export default HeaderTool;
