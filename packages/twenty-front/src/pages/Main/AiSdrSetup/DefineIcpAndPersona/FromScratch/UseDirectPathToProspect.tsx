import { Control, FieldValues } from "react-hook-form";

import Switch from "../../../../../components/base/Switch";

interface Props {
  control: Control<FieldValues, boolean>;
}

const UseDirectPathToProspect: React.FC<Props> = ({ control }) => (
  <div className='flex flex-col gap-12'>
    <div className='w-full flex px-5 mb-4 gap-3'>
      <span className={`font-bold text-neutral-800 dark:text-neutral-200 text-base`}>
        Use direct path to prospect
      </span>
      <span className={`font-normal  dark:text-neutral-200 text-base text-[#94A3B8]`}>
        (optional: will check the team for the best path to prospects in accounts and reach out)
      </span>
    </div>
    <Switch name='useDirectPathToProspect' control={control} />
  </div>
);

export default UseDirectPathToProspect;
