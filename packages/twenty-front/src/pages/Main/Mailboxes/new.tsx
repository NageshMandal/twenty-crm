import React from "react";

const MailBoxesPage: React.FC = () => {
  return (
    <div>
      <div className='flex items-center justify-between'>
        <div className='flex items-center justify-start gap-20'>
          <h2 className='font-normal select-none text-25 text-neutral-800 dark:text-neutral-300'>
            MailBoxes
          </h2>
        </div>
      </div>
    </div>
  );
};

export default MailBoxesPage;
