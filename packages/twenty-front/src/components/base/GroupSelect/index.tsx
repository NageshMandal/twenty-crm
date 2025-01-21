import React from "react";
import { Listbox } from "@headlessui/react";

import Icon from "../Icon";
import { IGroupSelectMenu } from "../../../utils/types";
import { IAskAiPrompt } from "../../../utils/types/social-selling";

type SelectProps = {
  label?: string;
  list: IGroupSelectMenu[];
  value?: number | string;
  onChange: Function;
  defaultValue?: string;
  originList?: IAskAiPrompt[];
};

const GroupSelect: React.FC<SelectProps> = ({
  list,
  originList,
  value,
  defaultValue,
  onChange = () => {},
}) => {
  return (
    <div className={`relative w-100`}>
      <Listbox>
        <Listbox.Button className='flex items-center justify-center w-full gap-8 font-normal transition-all duration-200 border outline-none select-none drop-shadow-sm focus:outline-none py-9 large:px-12 px-14 text-14 min-w-80 rounded-xl ring-transparent border-borderColor dark:border-borderColor-dark'>
          <span className='text-neutral-800 dark:text-neutral-300 w-100'>
            {originList?.find((item) => item.id === value)?.name ?? defaultValue}
          </span>
          <Icon
            name='ChevronDown'
            className='flex none w-17 h-17 text-neutral-800 dark:text-neutral-300'
          />
        </Listbox.Button>

        <Listbox.Options className='absolute z-10 px-4 py-8 pb-10 mt-4 border rounded-md shadow-2xl mb-30 w-fit whitespace-nowrap bg-modalContentColor dark:bg-modalContentColor-dark border-borderColor dark:border-borderColor-dark'>
          {list.map((item) => (
            <div
              key={item.groupName}
              className='flex flex-col px-4 cursor-default select-none text-16 text-neutral-800'
            >
              <p className='font-medium text-primary text-14'>{item.groupName}</p>
              <div className='flex flex-col'>
                {item.options?.map((option, optionIndex) => (
                  <Listbox.Option
                    key={optionIndex}
                    className={({ active }) =>
                      `w-full shadow-2xl  rounded-md z-10 px-8 cursor-pointer ${
                        active ? "bg-hoverColor dark:bg-hoverColor-dark" : ""
                      }`
                    }
                    onClick={() => onChange(option?.id)}
                    value={item}
                  >
                    <p className={`text-14 text-neutral-800 dark:text-neutral-300`}>
                      {option.name}
                    </p>
                  </Listbox.Option>
                ))}
              </div>
            </div>
          ))}
        </Listbox.Options>
      </Listbox>
    </div>
  );
};

export default GroupSelect;
