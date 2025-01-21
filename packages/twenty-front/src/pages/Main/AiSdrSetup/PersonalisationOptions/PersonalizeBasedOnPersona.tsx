import { Control, FieldValues } from "react-hook-form";

import Switch from "../../../../components/base/Switch";

interface Props {
  control: Control<FieldValues, boolean>;
}

const PersonalizeBasedOnPersona: React.FC<Props> = ({ control }) => (
  <div className='flex flex-col gap-12'>
    <div className='w-full flex px-5 mb-4 gap-3'>
      <span className={`font-bold text-neutral-800 dark:text-neutral-200 text-base`}>
        Personalize Based on Persona
      </span>
      <span className={`font-normal  dark:text-neutral-200 text-base text-[#94A3B8]`}>
        (Salestools AI will define personas and reach them based on Seniority level and use case for
        them to maximise reply rates)
      </span>
    </div>
    <Switch name='personalizeOnPersona' control={control} />
  </div>
);

export default PersonalizeBasedOnPersona;
