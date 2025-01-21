import React from "react";

import Icon from "src/components/base/Icon";
import { IOverview } from "src/utils/types/leads";
import { autoEmailList, customList, linkedInList, manualEmailList } from "src/utils/constants/lead";

type Props = {
  overview?: IOverview;
};

const Sequence: React.FC<Props> = ({ overview }) => (
  <>
    <h2 className='px-4 py-16 font-bold text-16 text-neutral-800 dark:text-neutral-300'>
      Automation Status
    </h2>
    <div className='flex gap-20'>
      <div className='border rounded-md bg-contentColor dark:bg-contentColor-dark w-280 h-280 border-borderColor dark:border-borderColor-dark'>
        <div className='flex items-center justify-between py-10 border-b px-17 dark:border-borderColor-dark border-borderColor'>
          <div className='flex items-center gap-10'>
            <div className='p-8 rounded-md bg-warning/10'>
              <Icon name='DEmail' />
            </div>
            <p className='text-sky-700 dark:text-neutral-300 text-16'>Auto-emails</p>
          </div>
          <p className='text-16 text-warning'>{overview?.auto_emails.count} sent</p>
        </div>
        <div className='px-16 py-4 divide-y divide-borderColor dark:divide-borderColor-dark'>
          {autoEmailList.map((item) => (
            <div key={item.value} className='flex justify-between py-8'>
              <p className='text-14 text-neutral-800 dark:text-neutral-300'>{item.label}</p>
              <p className='text-14 text-primary'>{overview?.auto_emails[item.value]}</p>
            </div>
          ))}
        </div>
      </div>

      <div className='border rounded-md bg-contentColor dark:bg-contentColor-dark w-280 h-280 border-borderColor dark:border-borderColor-dark'>
        <div className='flex items-center justify-between py-10 border-b px-17 dark:border-borderColor-dark border-borderColor'>
          <div className='flex items-center gap-10'>
            <div className='p-8 rounded-md bg-info/10'>
              <Icon name='DTask1' />
            </div>
            <p className='text-sky-700 dark:text-neutral-300 text-16'>1-1 Task</p>
          </div>
          <p className='text-16 text-info'>{overview?.manual_emails?.count} total</p>
        </div>
        <div className='px-16 py-4 divide-y divide-borderColor dark:divide-borderColor-dark'>
          {manualEmailList.map((item) => (
            <div key={item.value} className='flex justify-between py-8'>
              <p className='text-14 text-neutral-800 dark:text-neutral-300'>{item.label}</p>
              <p className='text-14 text-primary'>{overview?.manual_emails[item.value]}</p>
            </div>
          ))}
        </div>
      </div>

      <div className='border rounded-md bg-contentColor dark:bg-contentColor-dark w-280 h-280 border-borderColor dark:border-borderColor-dark'>
        <div className='flex items-center justify-between py-10 border-b px-17 dark:border-borderColor-dark border-borderColor'>
          <div className='flex items-center gap-10'>
            <div className='p-8 rounded-md bg-danger/10'>
              <Icon name='DTask2' />
            </div>
            <p className='text-sky-700 dark:text-neutral-300 text-16'>Tasks</p>
          </div>
          <p className='text-16 text-danger'>{overview?.customs.count} total</p>
        </div>
        <div className='px-16 py-4 divide-y divide-borderColor dark:divide-borderColor-dark'>
          {customList.map((item) => (
            <div key={item.value} className='flex justify-between py-8'>
              <p className='text-14 text-neutral-800 dark:text-neutral-300'>{item.label}</p>
              <p className='text-14 text-primary'>{overview?.customs[item.value]}</p>
            </div>
          ))}
        </div>
      </div>

      <div className='border rounded-md bg-contentColor dark:bg-contentColor-dark w-280 h-280 border-borderColor dark:border-borderColor-dark'>
        <div className='flex items-center justify-between py-10 border-b px-17 dark:border-borderColor-dark border-borderColor'>
          <div className='flex items-center gap-10'>
            <div className='p-8 rounded-md bg-primary/10'>
              <Icon name='DLinkedin' />
            </div>
            <p className='text-sky-700 dark:text-neutral-300 text-16'>Linkedin</p>
          </div>
        </div>
        <div className='px-16 py-4 divide-y divide-borderColor dark:divide-borderColor-dark'>
          {linkedInList.map((item) => (
            <div key={item.value} className='flex justify-between py-8'>
              <p className='text-14 text-neutral-800 dark:text-neutral-300'>{item.label}</p>
              <p className='text-14 text-primary'>{overview?.linkedin[item.value]}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
);

export default Sequence;
