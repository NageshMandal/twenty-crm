import React from "react";
import Button from "src/components/base/Button";

type Props = {
  onNext: Function;
  onBack: Function;
};

const FromLead: React.FC<Props> = ({ onNext, onBack }) => {
  const handleNext = () => {
    onNext();
  };

  return (
    <div>
      <div className='flex flex-col gap-10 py-10 mt-10 items-center justify-center pt-10'>
        <h2 className='text-neutral-800 dark:text-neutral-300 text-16'>My Leads/CSV or Plugin</h2>
        <p className='text-neutral-700 dark:text-neutral-400 text-15'>
          Start an automation from My Contacts at anytime you like, this is the starting point for
          an automation taking place from my Contacts.
        </p>
      </div>
      <div className='flex gap-12 pt-30 items-center justify-center'>
        <Button className='w-130' buttonStyle='secondary' onClick={() => onBack()}>
          Back
        </Button>
        <Button className='w-130' onClick={handleNext}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default FromLead;
