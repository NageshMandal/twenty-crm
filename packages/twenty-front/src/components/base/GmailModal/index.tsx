import React, { Fragment, ReactNode, useRef } from "react";
import classNames from "classnames";
import { Transition } from "@headlessui/react";

import Icon from "../Icon";
import useOutsideClick from "../../../hook/common/useOutsideClick";
import Button from "../Button";
import { toast } from "react-toastify";

type ModalProps = {
  show: boolean;
  onClose?: Function;
  disabled?: boolean;
  className?: string;
  hideClose?: boolean;
  handleGmail?: any;
  isGmailPending?: boolean;
};

const Modal: React.FC<ModalProps> = ({
  show = false,
  onClose = () => {},
  disabled = false,
  className = "",
  hideClose = false,
  handleGmail = () => {},
  isGmailPending = false,
}) => {
  const ref = useRef<HTMLInputElement | null>(null);

  useOutsideClick(ref, () => {
    if (!disabled) onClose();
  });

  // handleGmail();
  const handleCopyClick = async () => {
    const clientId = "205009932925-gsdstosg9b4q5pu5tu74c6o5ssfkrqcm.apps.googleusercontent.com";
    try {
      await navigator.clipboard.writeText(clientId);
      toast.success("Copied to clipboard!");
    } catch (err) {
      console.error("Unable to copy to clipboard", err);
    }
  };

  return (
    <>
      <Transition appear show={show} as={Fragment}>
        <div className='relative z-50 dark:scrollbar-thumb-neutral-700 scrollbar-thumb-neutral-300 scrollbar-thin'>
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
          <div className='fixed inset-0 z-50 flex items-end justify-center py-20 overflow-hidden tablet:items-center'>
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
                <div
                  className={classNames(
                    "h-full tablet:p-20 p-15 text-neutral-800 dark:text-neutral-300",
                    className
                  )}
                >
                  <div className='text-18 bold text-center justify-center pb-20'>
                    Connect your Gsuite account
                  </div>
                  <div>
                    <div className='pb-10'>Follow the given steps to connect your account,</div>
                    <ol>
                      {/* <li>Watch the Youtube Tutorial </li> */}
                      <li>
                        1. Head over to your{" "}
                        <a
                          className='text-primary'
                          href='https://admin.google.com/u/1/ac/owl/list?tab=configuredApps'
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          Admin Panel
                        </a>{" "}
                      </li>
                      <li>2. Look for Demand's OAuth App using this Client ID </li>
                      <div className='pt-10 pb-20'>
                        205009932925-gsdstosg9b4q5pu5tu74c6o5ssfkrqcm.apps.googleusercontent.com
                      </div>
                      <div className='pt-4 pb-4'>
                        <Button buttonStyle='secondary' onClick={handleCopyClick}>
                          Copy Client ID
                        </Button>
                      </div>
                    </ol>
                  </div>
                  <div className='flex text-right justify-end pt-20 pb-20'>
                    <Button isPending={isGmailPending} onClick={handleGmail}>
                      Connect Account
                    </Button>
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

export default Modal;
