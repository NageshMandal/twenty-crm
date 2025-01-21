import { Link } from "react-router-dom";
import Icon from "../../../../../components/base/Icon";
import ReactSelect from "../../../../../components/base/ReactSelect";
import { ISelectOption } from "../../../../../utils/types";

interface Props {
  aiAccount: ISelectOption[];
  errors?: string;
  value?: ISelectOption;
  handleInputChange: (e: ISelectOption) => void;
}
const SelectAiAccount: React.FC<Props> = ({ aiAccount, errors, value, handleInputChange }) => {
  return (
    <div className='flex flex-col'>
      <div className='w-full flex mt-6 mb-4 justify-between'>
        <span className={`text-neutral-800 dark:text-neutral-200 text-xs`}>Select AI Account</span>
        <Link to={"#"} className='flex items-center gap-2 pb-4  dark:text-neutral-300 text-xs'>
          <Icon name='Setting' className='w-12 h-12' />
          <p className='text-primary'>Manage accounts</p>
        </Link>
      </div>
      <ReactSelect
        smallMenu
        options={aiAccount}
        value={value}
        onChange={(event) => {
          handleInputChange({ label: "aiAccount", value: event.value });
        }}
      />
      {errors && <p className='text-red-500'>{errors}</p>}
    </div>
  );
};

export default SelectAiAccount;
