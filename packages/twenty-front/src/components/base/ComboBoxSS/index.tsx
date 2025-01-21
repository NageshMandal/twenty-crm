import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { Control, Controller, FieldValues } from "react-hook-form";

import Icon from "../Icon";

type ComboBoxProps = {
  control: Control<FieldValues, any>;
  isAuth?: boolean;
  label?: string;
  list: any[];
  optionClassName?: string;
  name: string;
  onSelect?: (selectedItem: any) => void;
  placeholder?: string;
};

const ComboBoxSS: React.FC<ComboBoxProps> = ({
  control,
  isAuth = false,
  label,
  optionClassName,
  list,
  name,
  onSelect = () => {},
  placeholder,
}) => {
  const [query, setQuery] = useState("");

  const filteredList =
    query === ""
      ? list
      : list.filter((item: any) =>
          item.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value = {} }, fieldState: { error } }) => (
        <Combobox
          as='div'
          value={value}
          onChange={(selectedValue) => {
            onSelect(selectedValue);
            if (selectedValue !== null) {
              onChange(selectedValue);
            }
          }}
          className='relative'
          nullable
        >
          <Combobox.Label
            className={`block px-5 mb-2 font-normal text-14 text-neutral-800  ${
              isAuth ? "dark:text-neutral-800" : "dark:text-neutral-300"
            }`}
          >
            {label}
          </Combobox.Label>
          <Combobox.Input
            className={`block w-full px-12 py-8 placeholder-gray-400 border rounded-md shadow-sm appearance-none bg-transparent border-borderColor phone:text-16 focus:outline-none focus:border-primary focus:ring-primary focus:ring-1  text-neutral-800  ${
              isAuth
                ? "dark:border-borderColor dark:focus:border-primary dark:bg-contentColor dark:text-neutral-800"
                : "dark:border-neutral-600 dark:text-neutral-300"
            }`}
            displayValue={(item: any) => item?.name ?? placeholder}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Combobox.Button
            className={`absolute right-12 top-16 w-17 h-17 text-neutral-800  ${
              isAuth ? "dark:text-neutral-800" : "dark:text-neutral-300"
            }`}
          >
            <Icon name='ChevronDown' />
          </Combobox.Button>
          <Transition
            as={Fragment}
            leave='transition ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options
              className={`absolute z-50 w-full mt-2 overflow-auto border rounded-md shadow-2xl bg-contentColor scrollbar-thin scrollbar-thumb-gray-300  border-borderColor  ${
                isAuth
                  ? "dark:border-borderColor dark:scrollbar-thumb-neutral-300 dark:bg-contentColor"
                  : "dark:border-borderColor-dark dark:bg-contentColor-dark dark:scrollbar-thumb-neutral-700"
              } ${optionClassName ? optionClassName : "max-h-150"}`}
            >
              {filteredList.map((item: any, index: number) => (
                <Combobox.Option
                  key={index}
                  className={({ active, selected }) =>
                    `cursor-default select-none pl-10 pr-4 py-10 text-16 dark:text-neutral-300 text-neutral-800 
                    ${isAuth ? "dark:text-neutral-800" : "dark:text-neutral-300"}
                    ${active ? "bg-primary-3 dark:bg-primary-5" : ""}
                    ${selected ? "bg-primary-3 dark:bg-primary-5" : ""}`
                  }
                  value={item}
                >
                  {item.name}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          </Transition>
          {error ? (
            <div className='flex-1'>
              <p className='px-5 mt-1 text-red-500 text-14'>{error.message}</p>
            </div>
          ) : null}
        </Combobox>
      )}
    />
  );
};

export default ComboBoxSS;
