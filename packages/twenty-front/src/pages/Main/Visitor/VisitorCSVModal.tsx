import React from "react";

import Button from "src/components/base/Button";
import Checkbox from "src/components/base/Checkbox";
import ComboBox from "src/components/base/ComboBox";
import Input from "src/components/base/Input";
import Modal from "src/components/base/Modal";
import { Control, FieldValues, UseFormRegister } from "react-hook-form";
import { IStringObject, ITemplate } from "src/utils/types/leads";

type Props = {
  control: Control<FieldValues, any>;
  exportFields: IStringObject;
  handleExportCSV: Function;
  handleSaveTemplate: Function;
  isCSVLoading: boolean;
  isSaveLoading: boolean;
  onClose: Function;
  open: boolean;
  register: UseFormRegister<FieldValues>;
  selectedFields: string[];
  templates: ITemplate[];
  watchFields: FieldValues;
};

const VisitorCSVModal: React.FC<Props> = ({
  control,
  exportFields,
  handleExportCSV,
  handleSaveTemplate,
  isCSVLoading,
  isSaveLoading,
  onClose,
  open,
  register,
  selectedFields,
  templates,
  watchFields,
}) => {
  return (
    <Modal show={open} onClose={() => onClose()}>
      <div className='py-20 w-600'>
        <h3 className='font-normal text-center text-gray-800 dark:text-neutral-300 text-24 pb-30'>
          Export to CSV
        </h3>
        <ComboBox
          placeholder='Choose Template'
          control={control}
          name='template'
          optionClassName='max-h-250'
          list={templates}
          label='Template'
        />
        <div className='py-20'>
          <label
            className={`block px-5 mb-2 font-normal text-neutral-800 dark:text-neutral-200 text-16`}
          >
            Save as Template
          </label>
          <div className='flex justify-between w-full gap-10 pb-20'>
            <Input fullWidth register={register("templateName")} />
            <Button
              onClick={(event) => {
                event.stopPropagation();
                handleSaveTemplate();
              }}
              isPending={isSaveLoading}
              disabled={selectedFields?.length === 0 || watchFields?.templateName?.length === 0}
            >
              Save
            </Button>
          </div>
          <Input fullWidth register={register("optionalName")} label='Optional Name' />
        </div>
        <div>
          <label
            className={`block px-5 mb-2 font-normal text-neutral-800 dark:text-neutral-200 text-16`}
          >
            Export Fields
          </label>
          <div className='grid grid-cols-2 gap-10 px-6 pt-10 pb-20 overflow-auto max-h-350 dark:scrollbar-thumb-neutral-700 scrollbar-thumb-neutral-300 scrollbar-thin'>
            {Object.keys(exportFields)?.map((item) => (
              <Checkbox key={item} control={control} name={item} label={exportFields[item]} />
            ))}
          </div>
        </div>
        <div className='grid grid-cols-2 gap-20 mt-20'>
          <Button
            className='w-170'
            isPending={isCSVLoading}
            buttonClassName='flex justify-end'
            onClick={(event) => {
              event.stopPropagation();
              handleExportCSV();
            }}
          >
            Export
          </Button>
          <Button className='w-150' buttonStyle='secondary' onClick={() => onClose()}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default VisitorCSVModal;
