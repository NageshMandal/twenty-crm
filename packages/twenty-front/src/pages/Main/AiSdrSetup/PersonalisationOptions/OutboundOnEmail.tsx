import { Control, FieldValues } from "react-hook-form";

import Switch from "../../../../components/base/Switch";

interface Props {
  control: Control<FieldValues, boolean>;
}

const OutboundOnEmail: React.FC<Props> = ({ control }) => (
  <div className='flex flex-col gap-12'>
    <div className='w-full flex px-5 mb-4 gap-3'>
      <span className={`font-bold text-neutral-800 dark:text-neutral-200 text-base`}>
        Outbound on Email
      </span>
      <span className={`font-normal  dark:text-neutral-200 text-base text-[#94A3B8]`}>
        (Will use email to engage)
      </span>
    </div>
    <Switch name='outboundOnEmail' control={control} />
  </div>
);

export default OutboundOnEmail;
