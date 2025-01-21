import Input from "../../../../../components/base/Input";
import { ISelectOption } from "../../../../../utils/types";
interface Props {
  value?: ISelectOption;
  handleInputChange: (e: ISelectOption) => void;
  errors?: string;
}

const JobTitle: React.FC<Props> = ({ value, handleInputChange, errors }) => {
  const handleChange = (event: string) => {
    handleInputChange({ label: "jobTitle", value: event });
  };

  return (
    <div className='flex flex-col gap-12 w-full'>
      <div className='w-full flex px-5 mb-4 gap-3'>
        <span className={`font-bold text-neutral-800 dark:text-neutral-200 text-base`}>
          Job Title
        </span>
        <span className={`font-normal  dark:text-neutral-200 text-base text-[#94A3B8]`}>
          (required)
        </span>
      </div>
      <div className='flex items-center gap-12'>
        <Input
          fullWidth
          value={value?.value}
          onChange={(e) => {
            const newValue = String(e.target.value);
            handleChange(newValue);
          }}
        />
      </div>
      {errors && <p className='text-red-500'>{errors}</p>}
    </div>
  );
};

export default JobTitle;
