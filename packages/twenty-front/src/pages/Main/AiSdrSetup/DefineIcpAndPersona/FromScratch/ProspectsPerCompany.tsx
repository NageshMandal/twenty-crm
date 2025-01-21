import Input from "../../../../../components/base/Input";
import { ISelectOption } from "../../../../../utils/types";
interface Props {
  value?: ISelectOption;
  handleInputChange: (e: ISelectOption) => void;
  selectedBlock: number;
}

const ProspectsPerCompanyPerUser: React.FC<Props> = ({
  value,
  handleInputChange,
  selectedBlock,
}) => {
  const handleChange = (event: number) => {
    if (event > 30) {
      handleInputChange({ label: "prospectsPerCompanyPerUser", value: 30 });
    } else {
      handleInputChange({ label: "prospectsPerCompanyPerUser", value: event });
    }
  };

  return (
    <div className='flex flex-col gap-12 w-full'>
      <div className='w-full flex px-5 mb-4 gap-3'>
        <span className={`font-bold text-neutral-800 dark:text-neutral-200 text-base`}>
          {selectedBlock === 3
            ? "Leads To Prospect For Each Company Visited"
            : "Prospects per company per user"}
        </span>
        <span className={`font-normal  dark:text-neutral-200 text-base text-[#94A3B8]`}>
          (required maximum 30 per day)
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

export default ProspectsPerCompanyPerUser;
