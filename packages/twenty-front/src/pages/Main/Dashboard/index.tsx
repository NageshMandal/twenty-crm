import React from "react";
import { Helmet } from "react-helmet-async";

const DashboardPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title> Dashboard </title>
        <meta name='' content='' />
      </Helmet>
      <div>
        <div className='flex items-center justify-between'>
          <div className='flex items-center justify-start gap-20'>
            <h2 className='font-normal select-none text-25 text-neutral-800 dark:text-neutral-300'>
              Dashboard
            </h2>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
