import { useState } from "react";
import { FieldValues, useForm, useWatch } from "react-hook-form";

import Button from "../../../../components/base/Button";
import Icon from "../../../../components/base/Icon";
import { ISelectOption } from "../../../../utils/types";
import LanguageOfCampaign from "./LanguageOfCampaign";
import OutboundOnEmail from "./OutboundOnEmail";
import OutboundOnLinkedIn from "./OutboundOnLinkedIn";
import PersonalisationTypesAndSignals from "./PersonalisationTypesAndSignals";
import PersonalizeBasedOnPersona from "./PersonalizeBasedOnPersona";
import RankPriorityOfPersonalisationTypes from "./RankPriorityOfPersonalisationTypes";
import SidebarEdit, { FormData as SidebarEditFormData, defaultTypesAndSignalsData } from "./SidebarEdit";

export type TypesAndSignals = {
  title: string;
  data: SidebarEditFormData;
};

export interface FormData {
  typesAndSignals: TypesAndSignals[];
  languageOfCampaign: string;
  outboundOnLinkedIn: boolean;
  outboundOnEmail: boolean;
  addSocialEngagement: boolean;
  personalizeOnPersona: boolean;
}

const languages: ISelectOption[] = [
  { label: "English", value: "English" },
  { label: "Spanish", value: "Spanish" },
  { label: "French", value: "French" },
  { label: "Mandarin", value: "Mandarin" },
  { label: "German", value: "German" },
  { label: "Japanese", value: "Japanese" },
  { label: "Russian", value: "Russian" },
  { label: "Arabic", value: "Arabic" },
  { label: "Hindi", value: "Hindi" },
  { label: "Portuguese", value: "Portuguese" },
];

const typesAndSignals = [
  "Latest LinkedIn Post",
  "News about company",
  "Article about person",
  "Visitor Intent",
  "Company Hiring by role",
  "Blog post about company",
  "Funding Announcement",
  "G2 Review",
  "Podcast Research",
  "Recent Technology Install",
  "Recent Technology Drop",
  "Job Trends",
  "Customer Stories",
  "Events",
];

interface Props {
  setCurrentTab: (value: number) => void;
  onSave: (data: FormData) => void;
}
const PersonalisationOptions: React.FC<Props> = ({ setCurrentTab, onSave }) => {
  const [selectedTypeAndSignal, setSelectedTypeAndSignal] = useState<string | null>(null);
  const { control, handleSubmit } = useForm<FieldValues>({
    defaultValues: {
      typesAndSignals: [],
      languageOfCampaign: languages[0].value,
      outboundOnLinkedIn: true,
      outboundOnEmail: true,
      addSocialEngagement: false,
      personalizeOnPersona: false,
    },
  });

  const [formData, setFormData] = useState<FormData>({
    typesAndSignals: [],
    languageOfCampaign: languages[0].value,
    outboundOnLinkedIn: false,
    outboundOnEmail: false,
    addSocialEngagement: false,
    personalizeOnPersona: false,
  });
  const outboundOnLinkedIn = useWatch({ control, name: "outboundOnLinkedIn", defaultValue: true });
  const outboundOnEmail = useWatch({ control, name: "outboundOnEmail", defaultValue: true });
  const addSocialEngagement = useWatch({
    control,
    name: "addSocialEngagement",
    defaultValue: false,
  });
  const personalizeOnPersona = useWatch({
    control,
    name: "personalizeOnPersona",
    defaultValue: false,
  });

  const handleInputChange = (e: ISelectOption) => {
    setFormData({
      ...formData,
      [e.label]: e.value,
    });
  };

  const handleOrderOfTypesAndSignals = (value: string) => {
    const typeAndSignal = formData.typesAndSignals.find((v) => v.title === value);
    setSelectedTypeAndSignal(value);

    if (!typeAndSignal) {
      setFormData({
        ...formData,
        typesAndSignals: [
          ...formData.typesAndSignals,
          { title: value, data: defaultTypesAndSignalsData },
        ],
      });
    }
  };

  const handleUpdateTypesAndSignalsOrders = (typesAndSignalsOrderedTitles: string[]) => {
    setFormData({
      ...formData,
      typesAndSignals: typesAndSignalsOrderedTitles.map((title) => ({
        title,
        data: formData.typesAndSignals.find((v) => v.title === title)?.data,
      })),
    });
  };

  const handleEdit = (data: SidebarEditFormData) => {
    setSelectedTypeAndSignal(null);
    setFormData({
      ...formData,
      typesAndSignals: formData.typesAndSignals.map((typeAndSignal) =>
        typeAndSignal.title === selectedTypeAndSignal ? { ...typeAndSignal, data } : typeAndSignal
      ),
    });
  };

  const onSubmit = () => {
    const data = {
      ...formData,
      outboundOnLinkedIn,
      outboundOnEmail,
      addSocialEngagement,
      personalizeOnPersona,
    };
    onSave(data);
  };

  const handleRemoveTypeAndSignal = (typeAndSignal: string) => {
    setFormData({
      ...formData,
      typesAndSignals: formData.typesAndSignals.filter((v) => v.title !== typeAndSignal),
    });
  };

  const typeAndSignalsTitles = () =>
    formData.typesAndSignals.map((typeAndSignal) => typeAndSignal.title);

  return (
    <div className='w-full'>
      <div className='flex items-center gap-12 py-30 w-full'>
        <div className='p-12 overflow-hidden bg-primary-2 rounded-xl'>
          <Icon name='UserPlus' className='w-20 h-20 text-white' />
        </div>
        <p className='font-normal text-neutral-800 dark:text-neutral-300 text-24'>
          Personalisation Setup
        </p>
      </div>
      <form className='w-1/2' onSubmit={handleSubmit(onSubmit)}>
        <div className='grid grid-cols-1 space-y-24'>
          <PersonalisationTypesAndSignals
            typesAndSignals={typesAndSignals}
            selectedTypesAndSignals={typeAndSignalsTitles()}
            onSelect={handleOrderOfTypesAndSignals}
          />

          <div className='border-t border-gray-300 w-full' />

          <RankPriorityOfPersonalisationTypes
            selectedTypesAndSignals={typeAndSignalsTitles()}
            onRemoveTypeAndSignal={handleRemoveTypeAndSignal}
            onUpdateTypesAndSignalsOrders={handleUpdateTypesAndSignalsOrders}
          />

          <div className='border-t border-gray-300 w-full' />
          <OutboundOnLinkedIn control={control} />

          <div className='border-t border-gray-300 w-full' />
          <OutboundOnEmail control={control} />

          {/* <div className='border-t border-gray-300 w-full' />
          <AddSocialEngagementToCampaign control={control} /> */}

          <div className='border-t border-gray-300 w-full' />
          <PersonalizeBasedOnPersona control={control} />

          <div className='border-t border-gray-300 w-full' />
          <LanguageOfCampaign
            languages={languages}
            value={
              formData.languageOfCampaign
                ? { label: formData.languageOfCampaign, value: formData.languageOfCampaign }
                : undefined
            }
            handleInputChange={handleInputChange}
          />
        </div>
        <div className='flex justify-center gap-20 pt-90 '>
          <Button className='w-125' buttonStyle='secondary' onClick={() => setCurrentTab(0)}>
            Back
          </Button>
          <Button type='submit' className='w-125'>
            Save
          </Button>
        </div>
      </form>
      <SidebarEdit
        data={formData.typesAndSignals.find((v) => v.title === selectedTypeAndSignal)}
        showSidebarModal={!!selectedTypeAndSignal}
        setShowSidebarModal={() => setSelectedTypeAndSignal(null)}
        onSave={handleEdit}
      />
    </div>
  );
};

export default PersonalisationOptions;
