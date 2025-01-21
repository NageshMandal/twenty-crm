import { Control, FieldValues } from "react-hook-form";

import Switch from "../../../../../components/base/Switch";

interface Props {
  control: Control<FieldValues, boolean>;
}

const DirectPathBySeniorityLevel: React.FC<Props> = ({ control }) => (
  <div className='flex flex-col gap-12'>
    <div className='w-full flex px-5 mb-4 gap-3'>
      <span className={`font-bold text-neutral-800 dark:text-neutral-200 text-base`}>
        Direct path by Seniority level
      </span>
      <span className={`font-normal  dark:text-neutral-200 text-base text-[#94A3B8]`}>
        (optional:Only VP’s will send to VP’s or up, Directors to roles similar, and entry level
        employees to managers or under to use the seniority hierachy)
      </span>
    </div>
    <Switch name='directPathBySeniorityLevel' control={control} />
  </div>
);

export default DirectPathBySeniorityLevel;
