import { useEffect, useRef, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";

import { Link } from "react-router-dom";
import Button from "../../../../../components/base/Button";
import Icon from "../../../../../components/base/Icon";
import SidebarModal from "../../../../../components/base/SidebarModal";
import SidebarModalTestPrompt from "../../../../../components/base/SidebarModalTestPrompt";
import { ISelectOption } from "../../../../../utils/types";
import { TypesAndSignals } from "../index";
import PromptForSpecificTask from "./PromptForSpecificTask";
import SelectAiAccount from "./SelectAiAccount";
import SelectModel from "./SelectModel";
import SystemPromptStandardisation from "./SystemPromptStandardisation";
import TestPrompt from "./TestPrompt";
const trainedPrompt =
  "You are an expert persuader. Your job is to start sales conversations with potential customers as a representative of the company. You speak in a professional tone and manner with the experience of a 20 year veteran in the business field. You always are talking about how we would be able to help the person we are reaching out to and not";

const customPrompts = [
  {
    label: "News about company",
    value:
      "Write an introductory line to an email where you mention a piece of news about a company. The headline for the news you will mention is this: {{News Headline}}\n\nStart the introductory line with ‘I saw the news about’ and continue with a positive summary of the news headline;\n\nYou should not directly quote the news headline. The introductory line you are writing should be friendly and personal. Avoid formal or exaggerated expressions, and aim for a tone that is casual, friendly, and sounds like a real person speaking. Keep the line under 20 words. \n\nDo not put anything in quotation marks and do not make a numbered list.",
  },
  {
    label: "Blog post about company",
    value: `Write an introductory line to an email where you mention a piece of news about a company. 
    The headline for the news you will mention is this: {{News Headline}}

    Start the introductory line with 'I saw the news about' and continue with a positive summary of the news headline;

    You should not directly quote the news headline. 
    The introductory line you are writing should be friendly and personal. 
    Avoid formal or exaggerated expressions, and aim for a tone that is casual, friendly, and sounds like a real person speaking. 
    Keep the line under 20 words. 
    
    Do not put anything in quotation marks and do not make a numbered list.`,
  },
  {
    label: "Latest LinkedIn Post",
    value:
      "Write a line to open an email that briefly summarizes the following LinkedIn post made by the person you’re emailing: {{Post - Posts}}\n\nThe line should begin with ‘I wanted to reach out because I saw your post about’ and then continue with the quick summary of the post.\n\nThe summary should not directly quote the post.\n\nThe introductory line should be friendly and personal.\n\nAvoid formal or exaggerated expressions, and aim for a tone that is casual, friendly, and sounds like a real person speaking.\n\nKeep the line under 20 words.\n\nDo not put anything in quotation marks and do not make a numbered list.",
  },
  {
    label: "Article about person",
    value:
      "Write an introductory line to an email where you mention a piece of news about the person and his company. The headline for the news you will mention is this: {{News Headline}}\n\nStart the introductory line with ‘I saw the news about’ and continue with a positive summary of the news headline;\n\nYou should not directly quote the news headline. The introductory line you are writing should be friendly and personal. Avoid formal or exaggerated expressions, and aim for a tone that is casual, friendly, and sounds like a real person speaking. Keep the line under 20 words. \n\nDo not put anything in quotation marks and do not make a numbered list.",
  },
  {
    label: "Company Hiring by role",
    value:
      "Given a company with this company description: {{Description}}\n" +
      "This company is hiring for the following position: {{Title - Jobs}}\n" +
      "Given the company’s description, decide how hiring for this role would help the company accomplish their company mission.\n" +
      "Then take this information to write an introductory line of an email.\n" +
      "The line should begin like this: ‘I saw on your site that you are hiring for a {{Title - Jobs}}.  In my experience, companies hire for this role to \n" +
      "Then finish the line by sharing how that position can help their company accomplish their mission.\n" +
      "You should not directly quote from the company’s description.\n" +
      "The introductory line you are writing should be friendly and personal.\n" +
      "Avoid formal or exaggerated expressions, and aim for a tone that is casual, friendly, and sounds like a real person speaking.\n" +
      "Keep the line under 20 words.\n" +
      "Do not put anything in quotation marks and do not make a numbered list.",
  },
  {
    label: "Recent Technology Install",
    value:
      "{{comany name}} recently installed {{technology}}, write a small sentence as icebreaker for making an intro eye attention grabbing email Keep the line under 12 words. ",
  },
  {
    label: "Recent Technology Drop",
    value:
      "{{comany name}} recently dropped/cancelled {{technology}}, write a small sentence as icebreaker for making an intro eye attention grabbing email Keep the line under 12 words and ask why they dropped the technology. ",
  },
  {
    label: "Job Trends",
    value:
      "Determine the job title this company usually sells to using the input as a guide for what they do. Who gets most value out of the product and what is their usual job title? Give me two titles that are plural. Do not include any numbers or extra information. Just two titles of likely customers they sell to that are separated by 'and'. \n" +
      "Make sure you do not capitalize the names of the titles unless they are abbreviations.\n" +
      "Make sure you output titles that are plural\n" +
      "Make sure the outputs are not capitalized unless it is an abbreviation\n" +
      "The input is this: {{Bodytext}}",
  },
  {
    label: "Customer Stories",
    value:
      "Research {{domain}} check for customer stories and make a summary in 20 words, introduce with I read your customer story about and how that made you contact them in less than 20 words.",
  },
  {
    label: "Events",
    value:
      "research if {{domain}} is joining any upcoming events and ask a question if they are going and what they look to learn in less than 20 words.",
  },
];

const models = [
  { label: "Auto", value: "auto" },
  { label: "Model 1", value: "model1" },
  { label: "Model 2", value: "model2" },
  { label: "Model 3", value: "model3" },
];

const aiAccounts = [
  { label: "Salestools AI", value: "salestoolsAI" },
  { label: "Account 2", value: "account2" },
  { label: "Account 3", value: "account3" },
];

export type SystemPrompt = {
  type: "Custom" | "Salestools Trained Prompt" | "Import emails to design your style";
  value: string;
};

export const defaultTypesAndSignalsData = {
  model: models[0].label,
  aiAccount: aiAccounts[0].label,
  systemPrompt: {
    type: "Salestools Trained Prompt" as const,
    value: trainedPrompt,
  },
  promptForSpecificTask: "",
};

export interface FormData {
  model: string;
  aiAccount: string;
  systemPrompt: SystemPrompt;
  promptForSpecificTask: string;
  title?: string;
}

interface Props {
  data: TypesAndSignals;
  showSidebarModal: boolean;
  setShowSidebarModal: (value: boolean) => void;
  onSave: (data: FormData) => void;
}

const SidebarEdit: React.FC<Props> = ({ showSidebarModal, setShowSidebarModal, onSave, data }) => {
  const { handleSubmit } = useForm<FieldValues>();
  const promptForSpecificTaskRef = useRef(null);

  const [formData, setFormData] = useState<FormData>(data?.data || defaultTypesAndSignalsData);

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const [showTestPrompt, setShowTestPrompt] = useState(false);

  useEffect(() => {
    setFormData(data?.data || defaultTypesAndSignalsData);
    if (data?.title == "News about company") {
      setFormData({
        ...formData,
        promptForSpecificTask: customPrompts.find((prompt) => prompt.label === "News about company")
          ?.value,
      });
    } else if (data?.title == "Latest LinkedIn Post") {
      setFormData({
        ...formData,
        promptForSpecificTask: customPrompts.find(
          (prompt) => prompt.label === "Latest LinkedIn Post"
        )?.value,
      });
    } else if (data?.title == "Article about person") {
      setFormData({
        ...formData,
        promptForSpecificTask: customPrompts.find(
          (prompt) => prompt.label === "Article about person"
        )?.value,
      });
    } else if (data?.title == "Visitor Intent") {
      setFormData({
        ...formData,
        promptForSpecificTask: customPrompts.find((prompt) => prompt.label === "Visitor Intent")
          ?.value,
      });
    } else if (data?.title == "Company Hiring by role") {
      setFormData({
        ...formData,
        promptForSpecificTask: customPrompts.find(
          (prompt) => prompt.label === "Company Hiring by role"
        )?.value,
      });
    } else if (data?.title == "Blog post about company") {
      setFormData({
        ...formData,
        promptForSpecificTask: customPrompts.find(
          (prompt) => prompt.label === "Blog post about company"
        )?.value,
      });
    } else if (data?.title == "Funding Announcement") {
      setFormData({
        ...formData,
        promptForSpecificTask: customPrompts.find(
          (prompt) => prompt.label === "Funding Announcement"
        )?.value,
      });
    } else if (data?.title == "Recent Technology Install") {
      setFormData({
        ...formData,
        promptForSpecificTask: customPrompts.find(
          (prompt) => prompt.label === "Recent Technology Install"
        )?.value,
      });
    } else if (data?.title == "Recent Technology Drop") {
      setFormData({
        ...formData,
        promptForSpecificTask: customPrompts.find(
          (prompt) => prompt.label === "Recent Technology Drop"
        )?.value,
      });
    } else if (data?.title == "Job Trends") {
      setFormData({
        ...formData,
        promptForSpecificTask: customPrompts.find((prompt) => prompt.label === "Job Trends")?.value,
      });
    } else if (data?.title == "Customer Stories") {
      setFormData({
        ...formData,
        promptForSpecificTask: customPrompts.find((prompt) => prompt.label === "Customer Stories")
          ?.value,
      });
    } else if (data?.title == "Events") {
      setFormData({
        ...formData,
        promptForSpecificTask: customPrompts.find((prompt) => prompt.label === "Events")?.value,
      });
    }
  }, [data]);

  const handleInputChange = (e: ISelectOption) => {
    setErrors({
      ...errors,
      [e.label]: "",
    });

    setFormData({
      ...formData,
      [e.label]: e.value,
    });
  };

  const onSystemPromptChange = (value: string) => {
    setFormData({
      ...formData,
      systemPrompt: {
        type: formData.systemPrompt.type,
        value: value,
      },
    });
  };

  const onTypeChange = (value: SystemPrompt["type"]) => {
    if (value === "Custom") {
      setFormData({
        ...formData,
        systemPrompt: {
          type: value,
          value: formData.systemPrompt.value,
        },
      });
    } else {
      setFormData({
        ...formData,
        systemPrompt: {
          type: value,
          value: trainedPrompt,
        },
      });
    }
  };

  const onSubmit = () => {
    setFormData(defaultTypesAndSignalsData);
    if (promptForSpecificTaskRef.current) {
      const promptForSpecificTaskData = promptForSpecificTaskRef.current.getData();
      setFormData({
        ...formData,
        promptForSpecificTask: promptForSpecificTaskData,
      });
      onSave({
        ...formData,
        promptForSpecificTask: promptForSpecificTaskData,
      });
    } else {
      onSave(formData);
    }
  };

  const onPromptForSpecificTaskChange = (value: string) => {
    setFormData({
      ...formData,
      promptForSpecificTask: value,
    });
  };
  const handleTestPrompt = () => {
    setShowTestPrompt(true);
  };

  return (
    <>
      <SidebarModal
        className='w-500'
        show={showSidebarModal}
        onClose={() => setShowSidebarModal(false)}
      >
        <form className='flex flex-col gap-14' onSubmit={handleSubmit(onSubmit)}>
          <div className='px-12 py-16 mx-20 mt-10 font-normal border-b text-neutral-800 dark:text-neutral-300 text-18 border-borderColor dark:border-borderColor-dark'>
            <div className='flex items-center gap-8'>
              <div className='bg-primary-2 rounded-full'>
                <Icon name='LogoBuilder' className='w-20 h-20 text-white' />
              </div>
              {data?.title}
            </div>
            <div className='flex align-center justify-between mt-12'>
              <Link
                to={"#"}
                className='flex items-center gap-4 pb-4  dark:text-neutral-300 text-xs'
              >
                <Icon name='Play' className='w-12 h-12' />
                <p className='text-primary'>Watch tutorial</p>
              </Link>
              <Link
                to={"#"}
                className='flex items-center gap-4 pb-4  dark:text-neutral-300 text-xs'
              >
                <Icon name='Book' className='w-12 h-12' />
                <p className='text-primary'>Read our blog post on AI for Sales Prospecting</p>
              </Link>
            </div>
            <div className='flex flex-col gap-14'>
              <SelectModel
                models={models}
                value={
                  formData.model
                    ? { label: formData.model, value: formData.model }
                    : { label: models[0].label, value: models[0].value }
                }
                handleInputChange={handleInputChange}
              />
              <SelectAiAccount
                aiAccount={aiAccounts}
                value={
                  formData.aiAccount
                    ? { label: formData.aiAccount, value: formData.aiAccount }
                    : { label: aiAccounts[0].label, value: aiAccounts[0].value }
                }
                handleInputChange={handleInputChange}
              />
              <div className='bg-bodyBgColor dark:bg-bodyBgColor-dark dark:text-neutral-300'>
                <PromptForSpecificTask
                  value={formData.promptForSpecificTask}
                  onChange={onPromptForSpecificTaskChange}
                />
              </div>
              <SystemPromptStandardisation
                type={formData.systemPrompt.type}
                onTypeChange={onTypeChange}
                systemPrompt={formData.systemPrompt.value}
                onSystemPromptChange={onSystemPromptChange}
              />
            </div>
          </div>
          <div className='flex justify-between items-center gap-12 px-12 py-16 mx-20 mt-10 font-normal'>
            <Button buttonStyle='secondary' className='rounded-2xl h-26' onClick={handleTestPrompt}>
              Test Prompt
            </Button>
            <div className='flex gap-12'>
              <Button prefix='Coin' buttonStyle='white' className='rounded-2xl h-26'>
                1/lead
              </Button>
              <Button type='submit' buttonStyle='primary' className='font-bold rounded-sm'>
                Save
              </Button>
            </div>
          </div>
        </form>
      </SidebarModal>
      <SidebarModalTestPrompt
        className='w-500'
        show={showTestPrompt}
        onClose={() => setShowTestPrompt(false)}
      >
        <TestPrompt
          onClose={() => setShowTestPrompt(false)}
          formData={formData}
          models={models}
          aiAccounts={aiAccounts}
          customPrompts={customPrompts}
          promptForSpecificTask={formData.promptForSpecificTask}
        />
      </SidebarModalTestPrompt>
    </>
  );
};

export default SidebarEdit;
