import React, { Fragment, ReactNode, useRef } from "react";
import classNames from "classnames";
import { Transition } from "@headlessui/react";

import useOutsideClick from "../../../hook/common/useOutsideClick";
import Icon from "src/components/base/Icon";

type ModalProps = {
  show: boolean;
  onClose?: Function;
  disabled?: boolean;
  className?: string;
  hideClose?: boolean;
  mailbox?: any;
};

const ErrorsModal: React.FC<ModalProps> = ({
  show = false,
  onClose = () => {},
  disabled = false,
  className = "",
  hideClose = false,
  mailbox,
}) => {
  const ref = useRef<HTMLInputElement | null>(null);

  useOutsideClick(ref, () => {
    if (!disabled) onClose();
  });

  const getErrorsList = () => {
    let logs = [];

    if (mailbox.last_send_error) {
      logs = logs.concat(
        mailbox.last_send_error.map((err) => ({
          message: err.errors ? err.errors.message : err,
          created_at: null,
          actionType: "Sending",
        }))
      );
    }

    // if (mailbox.last_sync_error) {
    //   logs = logs.concat(
    //     mailbox.last_sync_error?.map((err) => ({
    //       message: err.errors ? err.errors?.message : err,
    //       created_at: null,
    //       actionType: "Syncing",
    //     })) || []
    //   );
    // }
    if (mailbox.last_sync_error) {
      // Convert to array if last_sync_error is not an array
      const errors = Array.isArray(mailbox.last_sync_error)
        ? mailbox.last_sync_error
        : [mailbox.last_sync_error]; // Wrap in an array if it's not

      logs = logs.concat(
        errors.map((err) => ({
          message: err.errors ? err.errors.message : err,
          created_at: null,
          actionType: "Syncing",
        }))
      );
    }
    return logs;
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
                    className={"w-24 h-24 absolute top-20 right-20 "}
                    onClick={() => {
                      if (!disabled) onClose();
                    }}
                    role='button'
                  >
                    <Icon name='Cross' className='dark:text-neutral-200 text-neutral-800' />
                  </div>
                )}
                <div className={classNames("h-full tablet:p-20 p-15 py-20 my-20", className)}>
                  {/* {JSON.stringify(getErrorsList())}
                   */}
                  <ul>
                    {getErrorsList().map((error, index) => (
                      <li key={index} className='dark:text-red-300 text-red-600'>
                        {`Action: ${error.actionType}, Message: ${error.message}`}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Transition>
    </>
  );
};

export default ErrorsModal;
