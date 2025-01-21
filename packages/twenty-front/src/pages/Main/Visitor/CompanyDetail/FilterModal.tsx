import React from "react";

import Modal from "src/components/base/Modal";

type Props = {
  onClose: Function;
  open: boolean;
  variant: "visitors" | "company";
  target: string;
};

const VisitorFilterModal: React.FC<Props> = ({ onClose, open, variant, target }) => {
  // console.log("variant: ", variant);
  // console.log("target: ", target);
  return (
    <Modal show={open} onClose={() => onClose()}>
      <div className='py-20 w-600'>
        <h3 className='font-normal text-center text-gray-800 dark:text-neutral-300 text-24 pb-30'>
          Create New Segment
        </h3>
      </div>
    </Modal>
  );
};

export default VisitorFilterModal;
