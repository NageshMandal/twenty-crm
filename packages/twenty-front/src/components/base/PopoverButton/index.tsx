import React, { ReactNode } from "react";
import { Popover } from "@headlessui/react";

type Props = {
  button: ReactNode;
  children?: ReactNode;
  className?: string;
  rounded?: boolean;
};

const PopoverButton: React.FC<Props> = ({ children, button, className }) => (
  <Popover className='relative flex items-center justify-center'>
    <Popover.Button className='outline-none'>{button}</Popover.Button>
    <Popover.Panel
      className={`absolute z-50 p-10 shadow-xl rounded-md select-none border top-44 right-0 bg-contentColor dark:bg-contentColor-dark border-borderColor dark:border-borderColor-dark ${className}`}
    >
      {children}
    </Popover.Panel>
  </Popover>
);

export default PopoverButton;
