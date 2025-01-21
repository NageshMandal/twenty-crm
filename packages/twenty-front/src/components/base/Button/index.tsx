import React, { ReactNode, useMemo } from "react";
import ReactLoading from "react-loading";
import classNames from "classnames";

import Icon from "../Icon";
import { IconType } from "../Icon";

type Props = {
  buttonClassName?: string;
  buttonStyle?: "primary" | "secondary" | "white" | "error" | "disabled" | "green";
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  iconClassName?: string;
  isPending?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  prefix?: IconType;
  rounded?: boolean;
  suffix?: IconType;
  type?: "submit" | "button" | "reset";
};

const Button: React.FC<Props> = ({
  type = "button",
  buttonStyle = "primary",
  className = "",
  children,
  rounded = false,
  onClick = () => {},
  isPending = false,
  disabled = false,
  fullWidth = false,
  buttonClassName = "",
  prefix,
  suffix,
}) => {
  const button = useMemo(() => {
    return disabled ? "disabled" : buttonStyle;
  }, [disabled, buttonStyle]);
  return (
    <div className={buttonClassName}>
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={classNames(
          className,
          "flex justify-center items-center border drop-shadow-sm focus:outline-none py-9  large:px-18 px-14 text-14 font-normal min-w-80 select-none transition-all duration-200 hover:shadow-md",
          rounded ? "rounded-full" : "rounded-xl",
          {
            "bg-primary text-white  border-transparent hover:bg-primary-2 focus:bg-primary":
              button === "primary",
            "bg-error-1 text-white  border-transparent hover:bg-error-2 focus:bg-error-1":
              button === "error",
            "bg-green-600 text-white  border-transparent hover:bg-green-700 focus:bg-green-700":
              button === "green",
            "bg-contentColor dark:bg-contentColor-dark text-primary  hover:text-primary-2 hover:bg-bodyBgColor !duration-0 dark:hover:bg-bodyBgColor-dark focus:text-primary-2 border-primary":
              button === "secondary",
            "bg-contentColor text-primary dark:bg-contentColor-dark dark:text-neutral-300 dark:border-borderColor-dark !duration-0 hover:text-primary-2 focus:text-primary-2 border-gray-300":
              button === "white",
            "w-full": fullWidth,
            "bg-gray-400 dark:bg-neutral-700 text-white dark:text-neutral-300  hover:bg-gray-400  focus:ring-gray-400 border-neutral-500/25":
              button === "disabled",
          }
        )}
      >
        {prefix && !isPending && (
          <Icon
            name={prefix}
            className={`w-20 h-20 pr-3 flex-none ${
              buttonStyle === "white" ? "text-neutral-800 dark:text-neutral-300" : ""
            }`}
          />
        )}
        {isPending ? (
          <ReactLoading
            type='bars'
            width={24}
            height={21}
            color={buttonStyle === "primary" || buttonStyle === "error" ? "white" : "#2285E1"}
          />
        ) : (
          <div
            className={`select-none whitespace-nowrap ${prefix ? "large:pl-6:pl-4 min-w-50" : ""} ${
              suffix ? "large:pr-0 pr-4" : ""
            }`}
          >
            {children}
          </div>
        )}
        {suffix && (
          <div className={`flex-none w-20 h-20 pl-3 flex justify-center items-center`}>
            <Icon name={suffix} />
          </div>
        )}
      </button>
    </div>
  );
};

export default Button;
