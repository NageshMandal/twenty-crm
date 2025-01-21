import classNames from "classnames";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { ISelectOption } from "../../../utils/types";
import { Control, Controller, FieldValues } from "react-hook-form";

type Props = {
  label?: string;
  isAuth?: boolean;
  isMulti?: boolean;
  name: string;
  options: ISelectOption[];
  placeholder?: string;
  control: Control<FieldValues, any>;
  handleChange?: Function;
  smallMenu?: boolean;
  top?: boolean;
};

const ReactSelectRh: React.FC<Props> = ({
  label = "",
  isAuth,
  options,
  isMulti = false,
  control,
  name = "",
  placeholder,
  smallMenu,
  top,
  handleChange = () => {},
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
    <div onClick={(event) => event?.stopPropagation()}>
      {label && (
        <label
          className={`block px-5 mb-4 font-normal text-neutral-800 ${
            isAuth ? "dark:text-neutral-800" : "dark:text-neutral-200"
          } ${label.length ? "text-14" : "text-15"}`}
        >
          {label}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field: { value, onChange } }) => (
          <Select
            value={value}
            onChange={(val) => {
              onChange(val);
              handleChange(val);
            }}
            options={options}
            onMenuOpen={() => setIsMenuOpen(true)}
            onMenuClose={() => setIsMenuOpen(false)}
            isMulti={isMulti}
            menuPlacement={top ? "top" : isAboveMiddle ? "bottom" : "top"}
            placeholder={placeholder ?? ""}
            classNames={{
              menuList: () => (smallMenu ? "!max-h-150" : ""),
              control: ({ menuIsOpen, isFocused }) =>
                classNames(
                  "!bg-transparent !rounded-md !text-neutral-800 dark:!text-neutral-300 !shadow-none border-2 !cursor-text",
                  {
                    ["dark:!border-neutral-600 border-transparent"]: !menuIsOpen && !isFocused,
                    ["!ring-1 !ring-primary"]: menuIsOpen || isFocused,
                  }
                ),
              singleValue: () => "!text-neutral-800 dark:!text-neutral-300 !text-14 !pl-4",
              valueContainer: () => "!px-4",
              placeholder: () => "!pl-4 !text-neutral-600 dark:!text-neutral-400 !text-14",
              option: (state) =>
                classNames(
                  "!text-13 !leading-18 !text-neutral-800 dark:!text-neutral-300 !px-4 !cursor-pointer ",
                  {
                    ["!bg-hoverColor-2 dark:!bg-hoverColor-dark-2"]:
                      state.isFocused && !state.isSelected,
                    ["!bg-hoverColor dark:!bg-hoverColor-dark"]: state.isSelected,
                  }
                ),
              menu: () =>
                "!outline-none !py-1 !shadow-md !mt-1 !bg-contentColor dark:!bg-contentColor-dark !border !border-borderColor dark:!border-borderColor-dark dark:!scrollbar-thumb-neutral-700  react-menu dark:scrollbar-track-neutral-600 scrollbar-track-neutral-200",
              indicatorSeparator: () => "dark:!bg-neutral-600 !bg-borderColor !cursor-pointer",
              indicatorsContainer: () => "pr-2 !cursor-pointer",
              multiValue: () =>
                "!bg-hoverColor dark:!bg-hoverColor-dark !border !border-blue-200 dark:!border-blue-900/50 !rounded-3 !mr-1",
              multiValueLabel: () => "!text-neutral-800 dark:!text-neutral-300",
              multiValueRemove: () =>
                "hover:!bg-blue-200 dark:hover:!bg-blue-900/75 hover:!text-blue-400 hover:dark:!text-blue-500",
              input: () => "!text-neutral-800 dark:!text-neutral-300 !py-5 !pl-4",
            }}
          />
        )}
      />
    </div>
  );
};

export default ReactSelectRh;
