import React from "react";
import { Control, Controller, FieldValues } from "react-hook-form";
import { Switch as HeadlessSwitch } from "@headlessui/react";

type Props = {
  prefixLabel?: string;
  suffixLabel?: string;
  name: string;
  disabled?: boolean;
  control: Control<FieldValues, any>;
};

const Switch: React.FC<Props> = ({ name, control, prefixLabel, suffixLabel, disabled }) => (
  <div className='flex items-center gap-10'>
    {!!prefixLabel && (
      <p className='text-neutral-800 text-14 dark:text-neutral-300'>{prefixLabel}</p>
    )}
    <Controller
      name={name}
      control={control}
      render={({ field: { value = false, onChange } }) => (
        <HeadlessSwitch
          checked={value}
          disabled={disabled}
          onChange={(val) => onChange(val)}
          className={`relative inline-flex h-18 w-30 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 ${
            value ? "bg-primary" : "bg-neutral-400"
          }`}
        >
          <span
            aria-hidden='true'
            className={`translate-x-0 pointer-events-none inline-block h-14 w-14 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
              value ? "translate-x-12" : "translate-x-0"
            }`}
          />
        </HeadlessSwitch>
      )}
    />
    {!!suffixLabel && (
      <p className='text-neutral-800 text-14 dark:text-neutral-300'>{suffixLabel}</p>
    )}
  </div>
);

export default Switch;
