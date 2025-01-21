import { useState } from "react";

import Button from "../../../../components/base/Button";
import Icon, { IconType } from "../../../../components/base/Icon";
import Tooltip from "../../../../components/base/Tooltip";
import FromScratch, { FormData as FromScratchFormData } from "./FromScratch";

type TBlock = {
  icon: IconType;
  title: string;
  description: string;
  value: number;
  comingSoon?: boolean;
};

const blocks: TBlock[] = [
  { icon: "Visitor", title: "By Persona", description: "Lead type", value: 1 },
  {
    icon: "Building",
    title: "By Account Based Sales",
    description: "Multiple personas by account",
    value: 2,
  },
  { icon: "Web", title: "Website Visitors", description: "High Intent Visitors", value: 3 },
  {
    icon: "Visitor",
    title: "Uno-Reverse",
    description: "Sell back to pitchers",
    value: 4,
    comingSoon: true,
  },
];

interface Props {
  currentMethod: number;
  setCurrentMethod: (value: number) => void;
  setCurrentTab: (value: number) => void;
  onNext: (data: FromScratchFormData) => void;
}
const DefineIcpAndPersona: React.FC<Props> = ({
  currentMethod,
  setCurrentMethod,
  setCurrentTab,
  onNext,
}) => {
  const [selectedBlock, setSelectedBlock] = useState<number>(0);

  return (
    <div>
      {currentMethod ? (
        <FromScratch
          onNext={(data: FromScratchFormData) => {
            onNext(data);
            setCurrentTab(1);
          }}
          onPrevious={() => {
            setCurrentTab(0);
            setCurrentMethod(0);
          }}
          selectedBlockValue={selectedBlock}
        />
      ) : (
        <>
          <div className='flex items-center gap-12 py-30'>
            <div className='p-12 overflow-hidden bg-primary-2 rounded-xl'>
              <Icon name='UserPlus' className='w-20 h-20 text-white' />
            </div>
            <p className='font-normal text-neutral-800 dark:text-neutral-300 text-24'>
              How do you want to target your ICP?
            </p>
          </div>
          <div className='flex flex-wrap items-center justify-center gap-30'>
            {blocks.map((item) => (
              <Tooltip label={item.comingSoon ? "Coming Soon" : item.title}>
                <div
                  key={item.icon}
                  className={
                    `relative flex items-center justify-center transition-all duration-200 border-2 cursor-pointer rounded-2xl w-300 h-210 border-primary-1 hover:brightness-90 ` +
                    `${item.comingSoon ? "opacity-50 cursor-pointer" : "opacity-100"}`
                  }
                  onClick={() => {
                    setSelectedBlock(item.value);
                  }}
                >
                  {selectedBlock === item.value && (
                    <Icon
                      name='CheckRing'
                      className='absolute top-8 right-8 w-30 h-30 text-success-1'
                    />
                  )}
                  <div className='flex flex-col items-center justify-center gap-14'>
                    <div className='w-56 h-56 p-10 overflow-hidden rounded-md bg-primary-1'>
                      <Icon name={item.icon} className='w-full h-full text-white' />
                    </div>
                    <div className='flex flex-col items-center justify-center gap-2'>
                      <p className='font-semibold text-16 text-neutral-900 dark:text-neutral-300'>
                        {item.title}
                      </p>
                      <p className='text-12 text-neutral-900 dark:text-neutral-300'>{item.title}</p>
                    </div>
                  </div>
                </div>
              </Tooltip>
            ))}
          </div>
          <div className='flex justify-center gap-20 pt-90 '>
            <Button
              className='w-125'
              disabled={selectedBlock === 0}
              onClick={() => setCurrentMethod(selectedBlock)}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default DefineIcpAndPersona;
