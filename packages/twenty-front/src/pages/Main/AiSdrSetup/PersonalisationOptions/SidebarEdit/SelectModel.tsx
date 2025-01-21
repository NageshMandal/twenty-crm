import ReactSelect from "../../../../../components/base/ReactSelect";
import { ISelectOption } from "../../../../../utils/types";

interface Props {
  models: ISelectOption[];
  errors?: string;
  value?: ISelectOption;
  handleInputChange: (e: ISelectOption) => void;
}
const SelectModel: React.FC<Props> = ({ models, errors, value, handleInputChange }) => {
  return (
    <div className='flex flex-col'>
      <div className='w-full flex mt-6 mb-4 gap-3'>
        <span className={`text-neutral-800 dark:text-neutral-200 text-xs`}>Select a Model</span>
      </div>
      <ReactSelect
        smallMenu
        options={models}
        value={value}
        onChange={(event) => {
          handleInputChange({ label: "model", value: event.value });
        }}
      />
      {errors && <p className='text-red-500'>{errors}</p>}
    </div>
  );
};

export default SelectModel;
