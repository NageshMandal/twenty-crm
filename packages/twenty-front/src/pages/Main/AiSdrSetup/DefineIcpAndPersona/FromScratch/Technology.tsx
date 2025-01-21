import ReactSelect from "../../../../../components/base/ReactSelect";
import { useTechnology } from "../../../../../hooks/lead/useTechnology";
import { ISelectOption } from "../../../../../utils/types";
s
interface Props {
  value?: ISelectOption;
  handleInputChange: (e: ISelectOption) => void;
}
const Technology: React.FC<Props> = ({ value, handleInputChange }) => {
  const { technologyList } = useTechnology();

  return (
    <div className='flex flex-col gap-12'>
      <div className='w-full flex px-5 mb-4 gap-3'>
        <span className={`font-bold text-neutral-800 dark:text-neutral-200 text-base`}>
          Technology
        </span>
        <span className={`font-normal dark:text-neutral-200 text-base text-[#94A3B8]`}>
          (optional)
        </span>
      </div>
      <ReactSelect
        placeholder='Select a location'
        smallMenu
        options={technologyList}
        value={value}
        onChange={(event: { label: any; }) => {
          handleInputChange({ label: "technology", value: event.label });
        }}
      />
    </div>
  );
};

export default Technology;
