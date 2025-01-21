import React, { Fragment, ReactNode } from "react";
import { Transition } from "@headlessui/react";

type ModalProps = {
  children: ReactNode;
  show: boolean;
  onClose?: Function;
  disabled?: boolean;
  hideClose?: boolean;
  className?: string;
};

const SidebarModal: React.FC<ModalProps> = ({
  children,
  show = false,
  onClose = () => {},
  className = "",
}) => {
  return (
    <>
      <Transition appear show={show} as={Fragment}>
        <div className='relative' style={{ zIndex: 1000 }}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 overflow-hidden bg-black bg-opacity-25' />
          </Transition.Child>
          <div
            onClick={() => onClose()}
            className='fixed inset-0 z-50 flex items-end justify-end overflow-hidden tablet:items-center'
          >
            <Transition.Child
              as={Fragment}
              enter={"ease-out duration-300"}
              enterFrom={"translate-x-full"}
              enterTo={"translate-x-0"}
              leave={"transform transition ease-in-out duration-500"}
              leaveFrom={"translate-x-0"}
              leaveTo={"translate-x-full"}
            >
              <div
                onClick={(event) => event?.stopPropagation()}
                className={`relative h-screen border-l w-350 bg-modalContentColor dark:bg-contentColor-dark dark:border-borderColor-dark scrollbar-1 ${className}`}
                style={{ overflow: "auto" }}
              >
                {children}
              </div>
            </Transition.Child>
          </div>
        </div>
      </Transition>
    </>
  );
};

export default SidebarModal;
