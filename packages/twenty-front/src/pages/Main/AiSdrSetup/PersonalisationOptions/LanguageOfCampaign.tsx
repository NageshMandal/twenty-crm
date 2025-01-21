import ReactSelect from "../../../../components/base/ReactSelect";
import { ISelectOption } from "../../../../utils/types";

interface Props {
  languages: ISelectOption[];
  value?: ISelectOption;
  handleInputChange: (e: ISelectOption) => void;
}

const LanguageOfCampaign: React.FC<Props> = ({ languages, value, handleInputChange }) => (
  <div className='flex flex-col gap-12'>
    <div className='w-full flex px-5 mb-4 gap-3'>
      <span className={`font-bold text-neutral-800 dark:text-neutral-200 text-base`}>
        Language of Campaign
      </span>
      <span className={`font-normal  dark:text-neutral-200 text-base text-[#94A3B8]`}>
        (Salestools AI will use the selected language for your outreach)
      </span>
    </div>
    <div className='w-300'>
      <ReactSelect
        placeholder='Select a language'
        smallMenu
        options={languages}
        value={value}
        onChange={(event) => {
          handleInputChange({ label: "languageOfCampaign", value: event.value });
        }}
      />
    </div>
  </div>
);

export default LanguageOfCampaign;
