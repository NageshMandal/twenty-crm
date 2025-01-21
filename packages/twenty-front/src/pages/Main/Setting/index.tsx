import React from "react";

import Account from "./Account";
import Additional from "./Additional";
import VatSection from "./VatSection";
import ChargeebeeSection from "./ChargeebeeSection";

const SettingsPage: React.FC = () => {
  return (
    <div>
      <div className='flex items-center justify-between'>
        <div className='flex items-center justify-start gap-20'>
          <h2 className='font-normal select-none text-25 text-neutral-800 dark:text-neutral-300'>
            Settings Page
          </h2>
        </div>
      </div>
      <div className='grid w-full grid-cols-2 pt-20 gap-80 pb-50'>
        <Account />
        <div className='flex flex-col gap-10'>
          <Additional />
          <VatSection />
          <ChargeebeeSection />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
