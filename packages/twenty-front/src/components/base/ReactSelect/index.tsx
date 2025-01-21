import classNames from "classnames";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { ISelectOption } from "../../../utils/types";

type Props = {
  placeholder?: string;
  label?: string;
  isAuth?: boolean;
  isMulti?: boolean;
  options: ISelectOption[];
  value: any;
  top?: boolean;
  smallMenu?: boolean;
  onChange: Function;
  onInputChange?: (inputValue: string) => void;
};

const ReactSelect: React.FC<Props> = ({
  placeholder = "",
  label = "",
  isAuth = false,
  options,
  top,
  isMulti = false,
  value,
  smallMenu = false,
  onChange,
  onInputChange,
}) => {
  const [isAboveMiddle, setIsAboveMiddle] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleMouseMove = (event: any) => {
      const screenHeight = window.innerHeight;
      const middleScreen = (screenHeight / 7) * 4;
      const mouseY = event.clientY;
      if (!isMenuOpen) {
        setIsAboveMiddle(mouseY < middleScreen);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isMenuOpen]);

  return (
    <div onClick={(event) => event?.stopPropagation()} className='relative'>
      {label && (
        <label
          className={`block px-5 mb-4 font-normal text-neutral-800 ${
            isAuth ? "dark:text-neutral-800" : "dark:text-neutral-200"
          } ${label.length ? "text-14" : "text-15"}`}
        >
          {label}
        </label>
      )}

      <Select
        value={value}
        onChange={(val) => onChange(val)}
        options={options}
        onMenuOpen={() => setIsMenuOpen(true)}
        onMenuClose={() => setIsMenuOpen(false)}
        isMulti={isMulti}
        menuPlacement={top ? "top" : isAboveMiddle ? "bottom" : "top"}
        placeholder={placeholder}
        onInputChange={onInputChange}
        classNames={{
          menuList: () => (smallMenu ? "!max-h-150" : ""),
          control: ({ menuIsOpen, isFocused }) =>
            classNames(
              "!bg-transparent !rounded-md !text-neutral-800 !shadow-none border-2 !cursor-text",
              {
                ["dark:!border-neutral-600 border-transparent dark:!text-neutral-300"]:
                  !menuIsOpen && !isFocused && !isAuth,
                ["!ring-1 !ring-primary"]: menuIsOpen || isFocused,
                ["dark:!bg-contentColor !bg-contentColor"]: isAuth,
              }
            ),
          singleValue: () =>
            `${
              isAuth ? "!text-neutral-800" : "!text-neutral-800 dark:!text-neutral-300"
            }  !text-14 !pl-4`,
          valueContainer: () => "!px-4",
          placeholder: () => "!pl-4",
          option: (state) =>
            classNames(
              "!text-13 !leading-18 !text-neutral-800 dark:!text-neutral-300 !px-4 !cursor-pointer ",
              {
                ["!bg-hoverColor dark:!bg-hoverColor-dark"]: state.isFocused || state.isSelected,
                ["!text-neutral-800"]: isAuth,
              }
            ),
          menu: () =>
            `${
              isAuth
                ? "!bg-contentColor !border-borderColor scrollbar-track-neutral-200 !scrollbar-thumb-neutral-300"
                : "!bg-contentColor dark:!bg-contentColor-dark dark:!scrollbar-thumb-neutral-700 !border-borderColor dark:!border-borderColor-dark"
            } !outline-none !py-1 !shadow-md !mt-1 !border react-menu`,
          indicatorSeparator: () => `dark:!bg-neutral-600 !bg-borderColor !cursor-pointer`,
          indicatorsContainer: () => "pr-2 !cursor-pointer",
          multiValue: () =>
            "!bg-hoverColor dark:!bg-hoverColor-dark !border !border-blue-200 dark:!border-blue-900/50 !rounded-3 !mr-1",
          multiValueLabel: () => "!text-neutral-800 dark:!text-neutral-300",
          multiValueRemove: () =>
            "hover:!bg-blue-200 dark:hover:!bg-blue-900/75 hover:!text-blue-400 hover:dark:!text-blue-500",
          input: () =>
            `${
              isAuth ? "!text-neutral-800" : "!text-neutral-800 dark:!text-neutral-300"
            }  !py-5 !pl-4`,
        }}
      />
    </div>
  );
};

export default ReactSelect;
