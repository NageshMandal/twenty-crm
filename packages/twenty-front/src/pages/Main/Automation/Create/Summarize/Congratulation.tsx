import React from "react";
import Button from "src/components/base/Button";

import Icon from "src/components/base/Icon";
import { IWorkflowTemplate } from "src/utils/types/social-selling";

const Congratulation: React.FC<{
  setCurrentScreen: (screen: number) => void;
  workflowTemplate?: IWorkflowTemplate;
}> = ({ setCurrentScreen, workflowTemplate }) => {
  return (
    <div className='max-w-1140'>
      <div className='flex items-center gap-12 py-30'>
        <div className='p-12 overflow-hidden bg-primary-2 rounded-xl'>
          <Icon name='UserPlus' className='w-20 h-20 text-white' />
        </div>
        <p className='font-normal text-neutral-800 dark:text-neutral-300 text-24'>
          Automation: {workflowTemplate?.name} Started
        </p>
      </div>
      <div className='flex items-center justify-center flex-col'>
        <h1 className='title-1 text-20 font-medium text-center'>
          <b>Congratulations</b> you just started Automation "{workflowTemplate?.name}" read below
          to know what happen's next
        </h1>
        {/* <div className='grid grid-cols-12 w-710 pt-40 pb-30'>
          <div className='flex col-span-7 gap-10 justify-between pr-30 border-r border-borderColor dark:border-borderColor-dark items-center'>
            <div className='flex gap-10'>
              <div className='flex items-center justify-center overflow-hidden border rounded-md bg-primary-1 w-60 h-60 border-primary-1/80'>
                <p className='text-white text-26'>750</p>
              </div>
              <div className='flex flex-col font-medium justify-center'>
                <div className='text-primary'>Started</div>
                <p className='title-2 text-12 pb-6'>5 August 2023</p>
              </div>
            </div>
            <div className='text-neutral-800 dark:text-neutral-300'>
              <div className='flex items-center gap-10'>
                <Icon name='ThreeBarLeft' className='w-20 h-20' />
                <p className='font-medium text-18'>20</p>
              </div>
              <p className='text-14'>Leads per day</p>
            </div>
          </div>
          <div className='col-span-5 flex justify-center items-center gap-40 text-neutral-800 dark:text-neutral-300 '>
            <div>
              <p className='font-medium text-18'>120 Days</p>
              <p className='text-14'>Total Days running</p>
            </div>
            <div>
              <p className='font-medium text-18'>9 sept</p>
              <p className='text-14'>Est. end Date</p>
            </div>
          </div>
        </div> */}
        <div className='text-100'>
          <Icon name='Congratulation' className='w-120 h-120' />
        </div>
        <div className='flex flex-col items-center justify-center gap-4 pt-20'>
          <p className='text-neutral-800 dark:text-neutral-400 text-16'>
            You should expect prospects based on the number of{" "}
            <span className='text-neutral-900 font-semibold dark:text-neutral-300'>leads</span> you
            selected for Automation, to see data in my leads{" "}
            {/* <span className='text-neutral-900 font-semibold dark:text-neutral-300'>45 Min</span> */}
          </p>
          <p className='text-neutral-800 dark:text-neutral-400 text-16'>
            and as if you added{" "}
            <span className='text-neutral-900 font-semibold dark:text-neutral-300'>
              AI functions
            </span>{" "}
            that require deeper crawl on profiles{" "}
            <span className='text-neutral-900 font-semibold dark:text-neutral-300'>
              the first 60 leads
            </span>{" "}
            should execute in{" "}
            <span className='text-neutral-900 font-semibold dark:text-neutral-300'>
              within 90 Min to 180 Min
            </span>
          </p>
        </div>
        <Button
          className=' w-125 justify-center pt-10 px-4'
          buttonStyle='secondary'
          onClick={() => {
            setCurrentScreen(0);
          }}
        >
          Back
        </Button>
      </div>
    </div>
  );
};

export default Congratulation;
