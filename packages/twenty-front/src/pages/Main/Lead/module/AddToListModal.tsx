import React from "react";
import Modal from "../../../../components/base/Modal";
import ComboBox from "../../../../components/base/ComboBox";
import { Control, FieldValues } from "react-hook-form";
import UserChip from "../../../../components/base/UserChip";
import Button from "../../../../components/base/Button";
import { ILeadTag, IProspect } from "../../../../utils/types/leads";

type Props = {
  open: boolean;
  onClose: Function;
  control: Control<FieldValues, any>;
  isAddListPending: boolean;
  tags: ILeadTag[];
  selectedProspects: IProspect[];
  handleAddList: Function;
};

const AddToListModal: React.FC<Props> = ({
  open,
  onClose,
  control,
  isAddListPending = false,
  tags,
  selectedProspects,
  handleAddList,
}) => {
  return (
    <Modal show={open} onClose={() => onClose()}>
      <div className='py-20 w-600'>
        <h3 className='font-normal text-center text-gray-800 dark:text-neutral-300 text-24 pb-30'>
          Add to My List
        </h3>
        <p className='px-4 pb-4 text-14 text-neutral-800 dark:text-neutral-300'>
          Selected Prospects
        </p>
        <div className='flex flex-wrap gap-6 p-6 mb-20 overflow-auto border rounded-lg border-borderColor dark:border-borderColor-dark max-h-200 scrollbar-thin dark:scrollbar-thumb-neutral-700 scrollbar-thumb-neutral-300'>
          {selectedProspects?.map((item) => (
            <UserChip key={item.id} avatar={item.image_url} label={item.name} />
          ))}
        </div>
        <ComboBox
          placeholder='Choose Tags'
          control={control}
          name='tag'
          list={tags}
          label='Selected Tags'
        />
        <div className='grid grid-cols-2 gap-20 mt-80'>
          <Button
            className='w-170'
            isPending={isAddListPending}
            buttonClassName='flex justify-end'
            onClick={() => handleAddList()}
          >
            Add to List
          </Button>{" "}
          <Button className='w-150' buttonStyle='secondary' onClick={() => onClose()}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddToListModal;
