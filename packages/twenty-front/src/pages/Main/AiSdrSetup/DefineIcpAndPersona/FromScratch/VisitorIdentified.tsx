import { Control, FieldValues } from "react-hook-form";

import Switch from "../../../../../components/base/Switch";

interface Props {
  control: Control<FieldValues, boolean>;
}

const VisitorIdentified: React.FC<Props> = ({ control }) => (
  <div className='flex flex-col gap-12'>
    <div className='w-full flex px-5 mb-4 gap-3'>
      <span className={`font-bold text-neutral-800 dark:text-neutral-200 text-base`}>
        Contact If Person Identified
      </span>
    </div>
    <Switch name='visitorIdetified' control={control} />
  </div>
);

export default VisitorIdentified;
