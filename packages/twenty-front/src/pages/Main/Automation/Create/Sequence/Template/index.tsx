import React, { useMemo, useState } from "react";

import ListItem from "./ListItem";
import Button from "src/components/base/Button";

import temp1 from "src/assets/template/01.png";
import temp2 from "src/assets/template/02.png";
import temp3 from "src/assets/template/03.png";
import temp4 from "src/assets/template/04.png";
import temp5 from "src/assets/template/05.png";
import temp6 from "src/assets/template/06.png";

const itemList1 = [
  { id: 0, label: "All", count: 4 },
  { id: 1, label: "Recommended", count: 4 },
  // { id: 2, label: "Team Templates", count: 0 },
  // { id: 3, label: "Beginner", count: 32 },
  // { id: 4, label: "LinkedIn", count: 56 },
  // { id: 5, label: "LinkedIn + Email", count: 78 },
];

const itemList2 = [
  { id: 6, label: "Networking", count: 3 },
  { id: 7, label: "Job application", count: 3 },
  { id: 8, label: "Team Sales", count: 3 },
  { id: 9, label: "Recruiting", count: 4 },
  { id: 11, label: "Website Visitors", count: 4 },
  { id: 12, label: "Other", count: 3 },
  { id: 13, label: "Events", count: 4 },
];

const templateList = [
  // { label: "From Scratch (Build your own automation)", image: temp1, id: 1 },
  {
    label: "Invitation + 2 Messages",
    image: temp2,
    chip: "LinkedIn",
    id: 2,
    name: "Invitation + 2 Messages",
  },
  {
    label: "Message (1st relations only)",
    image: temp3,
    chip: "Linkedin",
    id: 3,
    name: "Message First Relation",
  },
  // { label: "Visit + Email Finder", image: temp4, chip: "Email + Linkedin", id: 4 },
  {
    label: "Invitation + Message",
    image: temp5,
    chip: "Email + Linkedin",
    id: 5,
    name: "Invitation + Message",
  },
  { label: "Visit", image: temp6, chip: "LinkedIn", id: 6, name: "Visit" },
];

type Props = {
  onNextStep: Function;
};

const Template: React.FC<Props> = ({ onNextStep }) => {
  const [currentTempId, setCurrentTempId] = useState(0);

  const currentTemplateLabel = useMemo(() => {
    if (itemList1?.find((item) => item.id === currentTempId)) {
      const currentTem = itemList1?.find((item) => item.id === currentTempId);
      return currentTem?.label;
    }
    if (itemList2?.find((item) => item.id === currentTempId)) {
      const currentTem = itemList2?.find((item) => item.id === currentTempId);
      return currentTem?.label;
    }
  }, [currentTempId]);

  return (
    <div className='flex gap-30'>
      <div className='w-full flex flex-col gap-2 max-w-240 h-[calc(100vh-330px)] overflow-auto pr-10 scrollbar-thin dark:scrollbar-thumb-neutral-800 scrollbar-thumb-neutral-300 pb-20'>
        {itemList1.map((item) => (
          <ListItem
            active={item.id === currentTempId}
            key={item.label}
            count={item.count}
            label={item.label}
            onClick={() => setCurrentTempId(item.id)}
          />
        ))}
        {/* <div className='flex items-center pt-30 gap-14 pb-25'>
          <p className='font-medium text-16 text-neutral-800 dark:text-neutral-100'>Use cases</p>
          <p className='px-8 py-6 overflow-hidden font-medium rounded-xl text-14 text-primary-2 bg-hoverColor2 dark:bg-hoverColor-dark'>
            Pre_field
          </p>
        </div>
        {itemList2.map((item) => (
          <ListItem
            key={item.id}
            active={item.id === currentTempId}
            count={item.count}
            label={item.label}
            onClick={() => setCurrentTempId(item.id)}
          />
        ))} */}
      </div>
      <div className=''>
        <Button prefix='BarSetting' suffix='Plus'>
          Filter
        </Button>
        <h2 className='pb-24 font-normal pt-14 text-24 text-neutral-800 dark:text-neutral-300'>
          {currentTemplateLabel}
        </h2>
        <div className='grid grid-cols-3 gap-x-20 gap-y-30 h-[calc(100vh-440px)] overflow-auto pr-10 scrollbar-thin dark:scrollbar-thumb-neutral-800 scrollbar-thumb-neutral-300 pb-30'>
          {templateList?.map((item) => (
            <div key={item.label} role='button' onClick={() => onNextStep(item.name)}>
              <img src={item.image} alt='template' className='w-280 h-180' />
              <div className='flex items-center justify-between pt-10'>
                <p className='text-14 text-neutral-800 dark:text-neutral-300'>{item.label}</p>
                {item.chip && (
                  <p
                    className={`p-2 px-8 rounded-xl text-14  ${
                      item.chip === "LinkedIn"
                        ? "text-primary bg-primary/20"
                        : "text-success-1 bg-success/20"
                    }`}
                  >
                    {item.chip}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Template;
