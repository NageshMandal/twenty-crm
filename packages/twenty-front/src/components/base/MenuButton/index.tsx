import { Fragment, ReactNode, useEffect, useRef, useState } from "react";
import { Transition } from "@headlessui/react";

import useOutsideClick from "src/hook/common/useOutsideClick";
import { ISelectOption } from "src/utils/types";

type MenuButtonProps = {
  className?: string;
  value?: number;
  onChange?: Function;
  menuList: ISelectOption[];
  itemClassName?: string;
  button: ReactNode;
  disabled?: boolean;
};

const MenuButton: React.FC<MenuButtonProps> = ({
  className = "",
  itemClassName = "",
  value,
  onChange = () => {},
  menuList,
  button,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [isAboveMiddle, setIsAboveMiddle] = useState(false);
  const [scrollValue, setScrollValue] = useState(150);

  const ref = useRef<HTMLInputElement | null>(null);

  useOutsideClick(ref, () => {
    if (!disabled) setOpen(false);
  });

  useEffect(() => {
    const handleMouseMove = (event: any) => {
      const screenHeight = window.innerHeight;
      setScrollValue(Math.floor(screenHeight / 4));
      const middleScreen = (screenHeight / 5) * 3;
      const mouseY = event.clientY;
      if (!open) {
        setIsAboveMiddle(mouseY < middleScreen);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [open]);

  return (
    <div className={`relative cursor-pointer flex-none h-full ${className}`}>
      <div
        className='h-full'
        onClick={() => {
          if (!disabled) {
            setOpen((prev) => !prev);
          }
        }}
      >
        {button}
      </div>
      <Transition
        show={open}
        as={Fragment}
        enter='transition ease-out duration-100'
        enterFrom='transform opacity-0 scale-95'
        enterTo='transform opacity-100 scale-100'
        leave='transition ease-in duration-75'
        leaveFrom='transform opacity-100 scale-100'
        leaveTo='transform opacity-0 scale-95'
      >
        <div
          ref={ref}
          className={`nowheel  absolute z-50 flex flex-col items-center justify-center px-4 py-6 mt-8 origin-top-right border rounded-md shadow-lg bg-modalContentColor dark:bg-modalContentColor-dark border-borderColor dark:border-borderColor-dark
          -translate-x-1/2 left-1/2 ${isAboveMiddle ? "" : "bottom-50"}`}
        >
          <div
            className={`flex flex-col gap-4 scrollbar-1`}
            style={{ maxHeight: `${scrollValue}px`, overflowY: "auto" }}
          >
            {menuList.map((item, index) => (
              <div
                key={index}
                id='nodeSelectOption'
                className={`border cursor-pointer whitespace-nowrap text-center px-6 py-6 text-14 rounded-md hover:bg-hoverColor hover:dark:bg-hoverColor-dark hover:!text-primary
                    ${itemClassName ? itemClassName : ""}
                    ${
                      value === item.value
                        ? "bg-hoverColor dark:bg-hoverColor-dark text-primary !border-blue-200  dark:!border-blue-900/50 "
                        : "text-gray-600 dark:text-neutral-400 border-transparent"
                    }
                    ${false ? "bg-hoverColor dark:bg-hoverColor-dark !text-primary " : ""}`}
                onClick={() => {
                  onChange(item.value);
                  setOpen(false);
                }}
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </Transition>
    </div>
  );
};

export default MenuButton;
