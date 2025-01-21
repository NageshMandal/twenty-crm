import ReactSelect from "../../../../../components/base/ReactSelect";
import { ISelectOption } from "../../../../../utils/types";

interface Props {
  locations: ISelectOption[];
  errors?: string;
  value?: ISelectOption;
  handleInputChange: (e: ISelectOption) => void;
  handleInputChangeExternally: (newInputValue: any) => void;
  selectedBlock: number;
}
const LocationHQ: React.FC<Props> = ({
  locations,
  errors,
  value,
  handleInputChange,
  handleInputChangeExternally,
  selectedBlock,
}) => {
  return (
    <div className='flex flex-col gap-12'>
      <div className='w-full flex px-5 mb-4 gap-3'>
        <span className={`font-bold text-neutral-800 dark:text-neutral-200 text-base`}>
          {/* Location */}
          Company HQ Location
        </span>
        <span className={`font-normal  dark:text-neutral-200 text-base text-[#94A3B8]`}>
          {selectedBlock === 3 ? "(optional)" : "(required)"}
        </span>
      </div>

      <ReactSelect
        placeholder='Select a location'
        smallMenu
        options={locations}
        value={value}
        onChange={(event) => {
          handleInputChange({ label: "location", value: event.label });
        }}
        onInputChange={handleInputChangeExternally}
      />
      {errors && <p className='text-red-500'>{errors}</p>}
    </div>
  );
};
export default LocationHQ;
