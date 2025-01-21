import React, { Fragment, ReactNode, useRef } from "react";
import classNames from "classnames";
import { Transition } from "@headlessui/react";

import Icon from "../Icon";
import useOutsideClick from "../../../hook/common/useOutsideClick";
import Input from "../Input";
import ReactSelect from "../ReactSelect";
import {
  autoStopOptions,
  scheduleRoot,
} from "src/pages/Main/Automation/Builder/TemplateFormOptions";
import Switch from "../Switch";
import { Controller, useForm } from "react-hook-form";
import Button from "../Button";

type ModalProps = {
  show: boolean;
  onClose?: Function;
  disabled?: boolean;
  className?: string;
  hideClose?: boolean;
  selectedStopCondition?: any;
  setSelectedStopCondition?: any;
  selectedTime?: any;
  setSelectedTime?: any;
  handleStopSelectChangeValue?: any;
  handleTimeSelectChange?: any;
  control?: any;
  onSettingSubmit?: any;
  handleSubmit?: any;
  isSavingBothSettings?: boolean;
};

const AutomationSettingModal: React.FC<ModalProps> = ({
  show = false,
  onClose = () => {},
  disabled = false,
  className = "",
  hideClose = false,
  selectedStopCondition = {},
  setSelectedStopCondition = () => {},
  selectedTime = {},
  setSelectedTime = () => {},
  handleStopSelectChangeValue = () => {},
  handleTimeSelectChange = () => {},
  control = {},
  onSettingSubmit = () => {},
  handleSubmit = () => {},
  isSavingBothSettings = false,
}) => {
  const ref = useRef<HTMLInputElement | null>(null);

  useOutsideClick(ref, () => {
    if (!disabled) onClose();
  });

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
                  className={classNames("h-full w-full tablet:p-20 pt-20 mt-20 pb-40", className)}
                >
                  <div className='text-neutral-800 dark:text-neutral-300 text-16 px-4 pb-40'>
                    Automation Settings
                    <div className='w-full h-20 border-b border-gray-300'></div>
                    <div className='py-10 pt-20'></div>
                    <form
                      className='flex flex-col gap-16 pt-10'
                      onSubmit={handleSubmit(onSettingSubmit)}
                    >
                      <ReactSelect
                        label='On Reply stop follow up or keep going?'
                        placeholder='Select an option'
                        options={autoStopOptions}
                        value={selectedStopCondition}
                        onChange={handleStopSelectChangeValue}
                        // onChange={() => {}}
                      />
                      <ReactSelect
                        label='Schedule (timezone)'
                        placeholder='Select an option'
                        options={scheduleRoot}
                        value={selectedTime}
                        onChange={handleTimeSelectChange}
                        // onChange={() => {}}
                      />
                      <Controller
                        name='syncToHubspot'
                        control={control}
                        render={({ field: { name } }) => (
                          <Switch
                            name={name} // name of the field
                            suffixLabel='Sync with Hubspot'
                            control={control}
                          />
                        )}
                      />
                      <Controller
                        name='syncToPipedrive'
                        control={control}
                        render={({ field: { name } }) => (
                          <Switch
                            name={name} // name of the field
                            suffixLabel='Sync with Pipedrive'
                            control={control}
                          />
                        )}
                      />
                      {/* <Switch
                        control={control}
                        name='syncToHubspot'
                        suffixLabel='Sync with Hubspot'
                      /> */}
                      {/* <Switch
                        control={control}
                        name='syncToPipedrive'
                        suffixLabel='Sync with Pipedrive'
                      /> */}
                      <Button
                        isPending={isSavingBothSettings}
                        disabled={isSavingBothSettings}
                        className='w-full mt-20'
                        type='submit'
                      >
                        Done
                      </Button>
                    </form>
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

export default AutomationSettingModal;
