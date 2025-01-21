import React, { InputHTMLAttributes, useState } from "react";
import classNames from "classnames";
import { FieldError } from "react-hook-form";

import Icon, { IconType } from "../Icon";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  addon?: string;
  divClassName?: string;
  error?: FieldError | any;
  fullWidth?: boolean;
  inputStyle?: "default";
  isAuth?: boolean;
  label?: string;
  prefix?: IconType;
  readonly?: boolean;
  register?: any;
  suffix?: IconType;
  suffixClick?: Function;
};

const Input: React.FC<Props> = ({
  addon,
  className = "",
  disabled = false,
  divClassName = "",
  error,
  fullWidth = false,
  inputStyle = "default",
  isAuth = false,
  label,
  name,
  prefix,
  readonly = false,
  register = {},
  suffix,
  suffixClick = () => {},
  type,
  ...props
}) => {
  const [passwordShown, setPasswordShown] = useState(false);

  const passwordVisible = () => {
    setPasswordShown((prev) => !prev);
  };

  return (
    <div className={`${divClassName} ${fullWidth ? "w-full" : ""}`}>
      {label && (
        <label
          onClick={(event) => event.stopPropagation()}
          htmlFor={name}
          className={`block px-5 mb-4 font-normal   text-neutral-800 ${
            isAuth ? "dark:text-neutral-800" : "dark:text-neutral-200"
          } ${label.length ? "text-14" : "text-15"}`}
        >
          {label}
        </label>
      )}
      <div className='relative flex w-full'>
        {addon && (
          <div
            className={classNames(
              "rounded-l-md px-20 py-12 text-16 border border-gray-500 shadow-sm border-r-0",
              { "border-red-500": error?.message }
            )}
          >
            {addon}
          </div>
        )}
        {prefix && (
          <div
            className={classNames("absolute w-20 h-20 left-10 top-12 text-neutral-900", {
              "text-gray-700": disabled,
            })}
          >
            <Icon name={prefix} />
          </div>
        )}
        <input
          id={name}
          name={name}
          type={suffix === "Eye" ? (passwordShown ? "text" : "password") : type}
          className={classNames(
            `block w-full border px-12 py-8 disable-stepper placeholder:text-neutral-600  shadow-sm bg-transparent phone:text-14 resize-none border-borderColor truncate dark:placeholder:text-neutral-400 
            ${
              isAuth
                ? "dark:bg-contentColor dark:text-neutral-800 dark:border-neutral-300 dark:focus:border-primary"
                : "dark:text-neutral-200 dark:border-neutral-600 dark:focus:!border-primary"
            }
            `,
            className,
            {
              "rounded-md focus:outline-none focus:border-primary focus:ring-primary focus:ring-1":
                inputStyle === "default",
              "block w-full rounded-md border px-12 py-12 shadow-sm text-16 border-red-500 text-red-500  ring-red-500":
                error?.message,
              "rounded-l-none": addon,
              "pl-35": prefix,
              "pr-35": suffix,
              "text-gray-700 border-gray-300": disabled,
            }
          )}
          style={{ "--webkit-appearance": "none" }}
          readOnly={readonly}
          disabled={disabled}
          {...props}
          {...register}
        />
        {suffix && (
          <div
            className={classNames("absolute w-20 h-20 right-12 top-11 text-neutral-900", {
              "text-gray-700": disabled,
            })}
            role='button'
            onClick={suffix === "Eye" ? passwordVisible : () => suffixClick()}
          >
            <Icon
              className='title-1'
              name={suffix && suffix === "Eye" ? (passwordShown ? "EyeSlash" : "Eye") : suffix}
            />
          </div>
        )}
      </div>
      {error?.message ? (
        <div className='flex-1'>
          <p className='block px-5 text-red-500 text-14'>{error.message}</p>
        </div>
      ) : null}
    </div>
  );
};

export default Input;
