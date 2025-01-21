import { Control, FieldValues } from "react-hook-form";

import Switch from "../../../../../components/base/Switch";

interface Props {
  control: Control<FieldValues, boolean>;
}

const AutopilotRepliesTurnedOn: React.FC<Props> = ({ control }) => (
  <div className='flex flex-col gap-12'>
    <div className='w-full flex px-5 mb-4 gap-3'>
      <span className={`font-bold text-neutral-800 dark:text-neutral-200 text-base`}>
        Autopilot Replies Turned On
      </span>
      <span className={`font-normal  dark:text-neutral-200 text-base text-[#94A3B8]`}>
        (optional: will automatically handle all replies, if turned off you need to review them and
        reply inside Salestools)
      </span>
    </div>
    <Switch name='autopilotRepliesTurnedOn' control={control} />
  </div>
);

export default AutopilotRepliesTurnedOn;
