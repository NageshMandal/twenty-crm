import React, { Fragment, ReactNode, useRef, useState } from "react";
import classNames from "classnames";
import { Transition } from "@headlessui/react";

import useOutsideClick from "../../../hook/common/useOutsideClick";
import Icon from "src/components/base/Icon";
import { toast } from "react-toastify";

type ModalProps = {
  show: boolean;
  onClose?: Function;
  disabled?: boolean;
  className?: string;
  hideClose?: boolean;
  mailbox?: any;
  handleSmtp?: Function;
  handleGmail?: Function;
  handleOffice?: Function;
};

const MailBoxChooserModal: React.FC<ModalProps> = ({
  show = false,
  onClose = () => {},
  disabled = false,
  className = "",
  hideClose = false,
  handleSmtp,
  handleGmail,
  handleOffice,
}) => {
  // console.log("mailboc data submitted:", mailbox);
  const ref = useRef<HTMLInputElement | null>(null);

  useOutsideClick(ref, () => {
    if (!disabled) onClose();
  });

  const Card = ({ title, description, iconClass, onClick }) => {
    return (
      <div className='p-4 md:w-1/3 sm:w-full' onClick={onClick}>
        <div className='border rounded-lg shadow-lg bg-gradient-to-br from-sky-200 to-sky-50 dark:bg-gradient-to-br dark:from-black-990 dark:to-gray-900 hover:from-blue-500 hover:to-blue-300 dark:hover:from-blue-600 dark:hover:to-blue-400 h-250 w-250 flex flex-col justify-center items-center transition duration-300 ease-in-out m-8 cursor-pointer'>
          <Icon
            name={iconClass || "Logo"}
            className='w-80 h-80 p-5 text-blue-500 dark:text-sky-300 hover:text-white dark:hover:text-white'
          />
          <h2 className='text-xl font-semibold dark:text-sky-100 p-4 text-center'>{title}</h2>
          <p className='mt-2 text-blue-200 dark:text-sky-300 text-center'>{description}</p>
        </div>
      </div>
    );
  };

  return (
    <>
      <Transition appear show={show} as={Fragment}>
        <div className=' relative z-50 dark:scrollbar-thumb-neutral-700 scrollbar-thumb-neutral-300 scrollbar-thin'>
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
          <div className='p-8 m-20 left-50 fixed inset-0 z-50 flex items-end justify-center py-20 overflow-hidden tablet:items-center'>
            <Transition.Child
              as={Fragment}
              enter={"ease-out duration-300"}
              enterFrom={"tablet:opacity-0 tablet:scale-95 translate-y-full tablet:translate-y-0"}
              enterTo={"opacity-100 scale-100 translate-y-0"}
              leave={"ease-in duration-200"}
              leaveFrom={"opacity-100 scale-100 translate-y-0"}
              leaveTo={"tablet:opacity-0 tablet:scale-95 translate-y-full tablet:translate-y-0"}
            >
              <div
                className='relative w-screen max-h-full pt-10 border bg-modalContentColor dark:bg-contentColor-dark dark:border-borderColor-dark rounded-t-2xl tablet:rounded-b-2xl tablet:w-auto scrollbar-thin dark:scrollbar-thumb-neutral-700 scrollbar-thumb-neutral-300 scrollbar-track-rounded-full'
                ref={ref}
                style={{ overflow: "auto" }}
              >
                {!hideClose && (
                  <div
                    className={"w-24 h-24 absolute top-20 right-20"}
                    onClick={() => {
                      if (!disabled) onClose();
                    }}
                    role='button'
                  >
                    <Icon name='Cross' className='dark:text-neutral-200 text-neutral-800' />
                  </div>
                )}
                <div className={classNames("h-full tablet:p-20 p-15 px-80 py-20 my-20", className)}>
                  <div className='flex flex-wrap justify-center'>
                    <Card
                      title='Other (IMAP/SMTP)'
                      description=''
                      iconClass='Envelop'
                      onClick={handleSmtp}
                    />
                    <Card title='Gmail' description='' iconClass='Envelop' onClick={handleGmail} />
                    <Card
                      title='Office'
                      description=''
                      iconClass='Envelop'
                      onClick={handleOffice}
                    />
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Transition>
    </>
  );
};

export default MailBoxChooserModal;
