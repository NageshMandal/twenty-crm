import { Control, FieldValues } from "react-hook-form";

import Switch from "../../../../components/base/Switch";

interface Props {
  control: Control<FieldValues, boolean>;
}

const AddSocialEngagementToCampaign: React.FC<Props> = ({ control }) => (
  <div className='flex flex-col gap-12'>
    <div className='w-full flex px-5 mb-4 gap-3'>
      <span className={`font-bold text-neutral-800 dark:text-neutral-200 text-base`}>
        Add Social Engagement to Campaign
      </span>
      <span className={`font-normal  dark:text-neutral-200 text-base text-[#94A3B8]`}>
        (require LinkedIn engagement and will engage on LinkedIn post with people before reaching
        out)
      </span>
    </div>
    <Switch name='addSocialEngagement' control={control} />
  </div>
);

export default AddSocialEngagementToCampaign;
