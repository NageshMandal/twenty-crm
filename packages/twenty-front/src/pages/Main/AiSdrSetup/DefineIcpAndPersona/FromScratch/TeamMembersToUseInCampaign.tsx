import React, { useEffect } from "react";
import ReactSelect from "../../../../../components/base/ReactSelect";
import { useMember } from "../../../../../hooks/lead/useMember";
import { ISelectOption } from "../../../../../utils/types";

interface Props {
  errors?: string;
  value?: ISelectOption[];
  handleInputChange: (e: { label: string; value: string[] }) => void;
}

const TeamMembersToUseInCampaign: React.FC<Props> = ({ errors, value, handleInputChange }) => {
  const { memberOptions } = useMember();

  useEffect(() => {
    if (!value || value.length === 0) {
      // Set the first option as the default if available
      if (memberOptions.length > 0) {
        handleInputChange({
          label: "teamMembers",
          value: [memberOptions[0].label as unknown as string],
        });
      }
    }
  }, [memberOptions, value, handleInputChange]);

  return (
    <div className='flex flex-col gap-12'>
      <div className='w-full flex px-5 mb-4 gap-3'>
        <span className={`font-bold text-neutral-800 dark:text-neutral-200 text-base`}>
          Team Members to use in campaign
        </span>
        <span className={`font-normal  dark:text-neutral-200 text-base text-[#94A3B8]`}>
          (required: Select the users in Salestools to use for this outreach campaign)
        </span>
      </div>
      <ReactSelect
        placeholder='Select team members'
        smallMenu
        isMulti
        options={memberOptions}
        value={value}
        onChange={(events) => {
          handleInputChange({
            label: "teamMembers",
            value: events.map((event) => event.label),
          });
        }}
      />
      {errors && <p className='text-red-500'>{errors}</p>}
    </div>
  );
};

export default TeamMembersToUseInCampaign;
