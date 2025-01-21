import React from "react";

import Modal from "../../base/Modal";
import Button from "../../base/Button";

type Props = {
  onClose: Function;
  handleDelete: Function;
  isPending?: boolean;
  open: boolean;
  title: string;
};

const DeleteModal: React.FC<Props> = ({
  open,
  onClose,
  handleDelete = () => {},
  isPending,
  title,
}) => {
  return (
    <Modal show={open} onClose={() => onClose()}>
      <div className='py-20 w-380'>
        <h2 className='font-normal text-center dark:text-neutral-200 text-neutral-800 text-24'>
          {title}
        </h2>
        <div className='flex justify-center gap-15 pt-25 '>
          <Button
            buttonStyle='error'
            onClick={(event) => {
              event.stopPropagation();
              handleDelete();
            }}
            isPending={isPending}
            type='submit'
            buttonClassName='flex justify-end'
          >
            Delete
          </Button>
          <Button
            onClick={() => onClose()}
            buttonClassName='flex justify-end'
            buttonStyle='secondary'
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;
