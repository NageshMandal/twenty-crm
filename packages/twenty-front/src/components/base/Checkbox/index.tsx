import React, { InputHTMLAttributes } from "react";
import { Control, Controller, FieldValues } from "react-hook-form";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  isAuth?: Boolean;
  labelClass?: string;
  name: string;
  control: Control<FieldValues, any>;
};

const Checkbox: React.FC<Props> = ({
  name,
  label,
  className = "",
  labelClass = "",
  control,
  isAuth,
  ...props
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value = false, onChange } }) => (
        <div className={`flex items-center justify-start py-4`}>
          <input
            id={`${name}-${label}`}
            onChange={() => {
              if (value) {
                onChange(false);
              } else {
                onChange(true);
              }
            }}
            checked={value}
            type='checkbox'
            className={`accent-primary border-2 dark:border-primary border-neutral-600  rounded cursor-pointer outline-none w-18 h-18 ${className} ${
              value ? "" : "appearance-none"
            }`}
            {...props}
          />
          <div
            className={`text-16 text-neutral-800 dark:text-neutral-300 pl-10 text-start select-none w-full ${labelClass}`}
          >
            {!!label && (
              <label
                htmlFor={`${name}-${label}`}
                className={`block w-full cursor-pointer ${isAuth ? "text-neutral-800" : "title-1"}`}
              >
                {label}
              </label>
            )}
          </div>
        </div>
      )}
    />
  );
};

export default Checkbox;
