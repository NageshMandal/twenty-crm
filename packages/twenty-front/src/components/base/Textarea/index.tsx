import React, { TextareaHTMLAttributes } from "react";
import classNames from "classnames";
import { FieldError } from "react-hook-form";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  register?: any;
  error?: FieldError | any;
  readonly?: boolean;
  inputStyle?: "default" | "profile";
  inputRef?: React.LegacyRef<HTMLTextAreaElement>;
};

const Textarea: React.FC<Props> = ({
  label,
  name,
  className = "",
  error,
  inputRef,
  readonly = false,
  inputStyle = "default",
  register = {},
  ...props
}) => (
  <div className='w-full'>
    {label && (
      <label
        htmlFor={name ?? register.name}
        className='block px-5 mb-4 font-normal text-14 text-neutral-800 dark:text-neutral-300'
      >
        {label}
      </label>
    )}
    <textarea
      ref={inputRef}
      id={name}
      name={name}
      className={classNames(
        "border w-full dark:text-neutral-300 p-8 dark:border-neutral-600 border-neutral-300 scrollbar-thin dark:scrollbar-thumb-neutral-600 scrollbar-thumb-neutral-300 bg-transparent",
        className,
        {
          "rounded-md focus:outline-none focus:border-primary focus:ring-primary focus:ring-1 dark:placeholder:text-neutral-400 placeholder:text-neutral-600 text-14":
            inputStyle === "default",
          "block w-full rounded-md border px-12 py-12 shadow-sm text-16 border-red-500 text-red-500  ring-red-500":
            error,
        }
      )}
      readOnly={readonly}
      {...props}
      {...register}
    />
    {error ? (
      <div className='flex-1'>
        <p className='block text-red-500 text-12'>{error.message}</p>
      </div>
    ) : null}
  </div>
);

export default Textarea;
