import React from "react";

import ProcessBar from "src/components/base/ProcessBar";
import Icon from "src/components/base/Icon";
import { ICompanyInsight } from "src/utils/types/visitor";
import Skeleton from "react-loading-skeleton";

const totalList = [
  { id: 1, label: "Belgium", percent: 75 },
  { id: 2, label: "India", percent: 65 },
  { id: 3, label: "Poland", percent: 50 },
];

const topList = [
  { id: 1, label: "Information Technology And Services", percent: 75 },
  { id: 2, label: "Accounting", percent: 65 },
  { id: 3, label: "Semiconductors", percent: 50 },
];

type Props = {
  companyInsight: ICompanyInsight;
  companyLoading: boolean;
};

const Insight: React.FC<Props> = ({ companyInsight, companyLoading }) => {
  return (
    <div className='px-32 pt-32 w-1000'>
      <div className='pb-18'>
        <h2 className='font-normal select-none text-20 text-neutral-900 dark:text-neutral-300'>
          Insights
        </h2>
      </div>
      <div className='flex gap-30'>
        <div>
          <div className='flex items-center gap-4'>
            <p className='uppercase text-neutral-600 text-12 dark:text-neutral-300'>
              Total Companies
            </p>
            <Icon name='Question' className='w-16 h-16 text-neutral-800 dark:text-neutral-300' />
          </div>
          <p className='text-24 text-neutral-800 dark:text-neutral-300'>
            {companyInsight?.totalCompany ?? 0}
          </p>
        </div>
        <div>
          <div className='flex items-center gap-4'>
            <p className='flex-none uppercase whitespace-pre text-neutral-600 text-12 dark:text-neutral-300'>
              Average companies per day
            </p>
            <Icon name='Question' className='w-16 h-16 text-neutral-800 dark:text-neutral-300' />
          </div>
          <p className='text-24 text-neutral-800 dark:text-neutral-300'>
            {companyInsight?.companyPerDay ?? 0}
          </p>
        </div>
      </div>
      {companyLoading ? (
        <div className='grid w-full grid-cols-2 gap-40 pt-20'>
          <div>
            <p className='uppercase text-neutral-600 text-12 dark:text-neutral-300'>
              Total Companies
            </p>
            <div className='flex flex-col gap-10 pt-16'>
              {[...new Array(4).keys()].map((item) => (
                <Skeleton key={item} count={1} height={40} style={{ borderRadius: "16px" }} />
              ))}
            </div>
          </div>
          <div>
            <p className='uppercase text-neutral-600 text-12 dark:text-neutral-300'>
              Top industries
            </p>
            <div className='flex flex-col gap-10 pt-16'>
              {[...new Array(4).keys()].map((item) => (
                <Skeleton key={item} count={1} height={40} style={{ borderRadius: "16px" }} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className='grid w-full grid-cols-2 gap-40 pt-20'>
          <div>
            <p className='uppercase text-neutral-600 text-12 dark:text-neutral-300'>
              Total Companies
            </p>
            <div className='flex flex-col gap-8 pt-16'>
              {companyInsight?.countryInfo?.map((item) => (
                <ProcessBar key={item?.country} label={item?.country} percent={item?.percent} />
              ))}
            </div>
          </div>
          <div>
            <p className='uppercase text-neutral-600 text-12 dark:text-neutral-300'>
              Top industries
            </p>
            <div className='flex flex-col gap-8 pt-16'>
              {companyInsight?.industryInfo?.map((item) => (
                <ProcessBar key={item?.industry} label={item?.industry} percent={item?.percent} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Insight;
