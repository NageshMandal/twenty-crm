import Input from "../../../../../components/base/Input";
import { ISelectOption } from "../../../../../utils/types";

interface Props {
  value?: ISelectOption;
  handleInputChange: (e: ISelectOption) => void;
  selectedBlock: number;
}

const CompaniesToProspect: React.FC<Props> = ({ value, handleInputChange, selectedBlock }) => {
  const handleChange = (event: number) => {
    if (event > 40) {
      handleInputChange({ label: "companiesToProspect", value: 40 });
    } else {
      handleInputChange({ label: "companiesToProspect", value: event });
    }
  };

  return (
    <div className='flex flex-col gap-12 w-full'>
      <div className='w-full flex px-5 mb-4 gap-3'>
        <span className={`font-bold text-neutral-800 dark:text-neutral-200 text-base`}>
          {selectedBlock === 1
            ? "Leads per day to prospect"
            : "Companies to prospect per day per user"}
        </span>
        <span className={`font-normal  dark:text-neutral-200 text-base text-[#94A3B8]`}>
          (required maximum 40 per day)
        </span>
      </div>
      <div className='flex items-center gap-12'>
        <Input
          fullWidth
          value={value?.value}
          onChange={(e) => {
            const newValue = Number(e.target.value);
            handleChange(newValue);
          }}
        />
      </div>
    </div>
  );
};

export default CompaniesToProspect;
