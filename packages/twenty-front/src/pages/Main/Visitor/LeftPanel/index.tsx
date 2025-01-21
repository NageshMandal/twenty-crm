import React, { useState } from "react";
import { HiOutlineRss } from "react-icons/hi";
import { AiOutlineMail } from "react-icons/ai";
import { FiFilter } from "react-icons/fi";

import Button from "src/components/base/Button";
import Icon from "src/components/base/Icon";
import Input from "src/components/base/Input";

const PanelList = [
  { label: "All Companies", key: "all_companies", message: false, filter: false },
  { label: "Companies assigned to", key: "assigned", message: true, filter: true },
  { label: "Followed Companies", key: "followed_companies", message: true, filter: true },
  { label: "New companies", key: "new_companies", message: false, filter: true },
  { label: "Top companies", key: "top_companies", message: false, filter: true },
];

type Props = {
  setTrackingStep: Function;
  trackingStep: number;
};

const LeftPanel: React.FC<Props> = ({ setTrackingStep, trackingStep }) => {
  const [text, setText] = useState("");
  return (
    <div className='pt-16 pr-20 border-r border-borderColor dark:border-borderColor-dark w-220'>
      <div className='relative'>
        {/* <Input
          divClassName='w-220'
          placeholder='Feed'
          value={text}
          onKeyDown={(event: any) => {
            if (event.code == "Enter") {
              setText(event?.target?.value);
            }
          }}
          onChange={(event) => setText(event?.target?.value)}
        />
        <Icon
          name='Cross'
          className='absolute -translate-y-1/2 w-22 h-22 right-10 text-neutral-700 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-300 top-1/2'
          onClick={() => {
            setText("");
          }}
        /> */}
        <div className='absolute mt-2 -translate-y-1/2 top-1/2 right-30'></div>
      </div>
      {/* <div>
        <Button className='w-full' buttonClassName='py-16' prefix='Plus'>
          Create New Feed
        </Button>
      </div> */}
      {/* <div className='flex items-center justify-start gap-4'>
        <HiOutlineRss className='title-1 text-20' />
        <p className='title-1'>Base</p>
      </div>
      <div className='flex flex-col gap-12 py-8'>
        {PanelList?.map((item) => (
          <div key={item.key} className='flex items-center justify-between text-14 title-1'>
            <p className='text-15'>{item.label}</p>
            <div className='flex items-center gap-12'>
              <AiOutlineMail className='w-18 h-18 ' />
              <FiFilter className='w-18 h-18 ' />
            </div>
          </div>
        ))}
      </div> */}
      <div className='flex items-center w-full gap-4 pt-20'>
        <Button
          prefix='Setting2'
          buttonClassName='!w-full'
          className='!w-full'
          onClick={() => setTrackingStep(1)}
        >
          Tracking Setup
        </Button>
      </div>
      <div className='flex flex-col gap-10 pt-16 w-220'>
        <p
          className={`text-15 title-2 hover:title-1 cursor-pointer ${
            trackingStep === 2 ? "!text-primary" : ""
          }`}
          onClick={() => setTrackingStep(2)}
        >{`Include pages to tracking`}</p>
        <p
          className={`text-15 title-2 hover:title-1 cursor-pointer ${
            trackingStep === 3 ? "!text-primary" : ""
          }`}
          onClick={() => setTrackingStep(3)}
        >{`Exclude from tracking`}</p>
      </div>
    </div>
  );
};

export default LeftPanel;
