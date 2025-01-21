import ReactSelect from "../../../../../components/base/ReactSelect";
import { industries } from "../../../../../utils/constants/industries";
import { ISelectOption } from "../../../../../utils/types";

interface Props {
  errors?: string;
  value?: ISelectOption;
  handleInputChange: (e: ISelectOption) => void;
  selectedBlock: number;
}

const Industry: React.FC<Props> = ({ errors, value, handleInputChange, selectedBlock }) => (
  <div className='flex flex-col gap-12'>
    <div className='w-full flex px-5 mb-4 gap-3'>
      <span className={`font-bold text-neutral-800 dark:text-neutral-200 text-base`}>Industry</span>
      <span className={`font-normal dark:text-neutral-200 text-base text-[#94A3B8]`}>
        {selectedBlock === 3 ? "(optional)" : "(required)"}
      </span>
    </div>
    <ReactSelect
      placeholder='Select an industry'
      smallMenu
      options={industries}
      value={value}
      onChange={(event) => {
        handleInputChange({ label: "industry", value: event.label });
      }}
    />
    {/* <ReactSelectRh
      control={control}
      options={Object.keys(configs.search.industries)?.map((item) => ({
        label: item,
        value: item,
      }))}
      label='Company Industry'
      name='companyIndustry'
    /> */}
    {errors && <p className='text-red-500'>{errors}</p>}
  </div>
);

export default Industry;
