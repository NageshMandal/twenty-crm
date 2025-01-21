import React, { useState } from "react";
import { toast } from "react-toastify";
import Button from "../../../../../components/base/Button";
import axios from "../../../../../utils/functions/axios";

const predefinedWords = [
  { id: 1, display: "/company_name", value: "Salestools" },
  { id: 2, display: "/first_name", value: "John" },
  { id: 3, display: "/last_name", value: "Doe" },
  { id: 4, display: "/title", value: "CEO" },
  { id: 5, display: "/location", value: "United States" },
  {
    id: 6,
    display: "/linkedin_post",
    value:
      "I'm thrilled to announce that Salestools has been named one of the top 10 sales automation tools #Salestools",
  },
  {
    id: 7,
    display: "/company_blog",
    value: "Why we changed our pricing model to better serve our customers",
  },
  { id: 8, display: "/tech_last_installed", value: "Last installed technology: Salesforce" },
  { id: 9, display: "/domain", value: "Salestools" },
  { id: 10, display: "/top_page", value: "Homepage" },
];

interface TestPromptProps {
  onClose: () => void;
  formData?: any;
  models?: any;
  aiAccounts?: any;
  customPrompts?: any;
  promptForSpecificTask?: string;
}

const TestPrompt: React.FC<TestPromptProps> = ({
  onClose,
  formData,
  models,
  aiAccounts,
  customPrompts,
  promptForSpecificTask,
}) => {
  let displayValue = formData.promptForSpecificTask;

  if (formData?.promptForSpecificTask) {
    predefinedWords.forEach((prompt: any) => {
      const regex = new RegExp(prompt.display, "g");
      displayValue = displayValue.replace(regex, prompt.value);
    });
  }

  const [userPrompt, setUserPrompt] = useState(displayValue);
  const [systemPrompt, setSystemPrompt] = useState(formData?.systemPrompt?.value);
  const [resultOfPrompts, setResultOfPrompts] = useState("");

  const handleUserPromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserPrompt(e.target.value);
  };

  const handleSystemPromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSystemPrompt(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      console.log("userPrompt: ", userPrompt);
      console.log("systemPrompt: ", systemPrompt);
      const response = await axios(true).post(
        `${process.env.REACT_APP_WORKFLOW_API_URL}/workflow/aisdrchatgpt/testprompt`,
        {
          data: {
            systemPrompt,
            userPrompt,
          },
        }
      );
      if (response) {
        toast.success("Successfully Submitted Prompt");
        console.log("response: ", response.data as unknown as any);
        setResultOfPrompts(response.data as unknown as string);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? error.message);
    }
  };

  return (
    <div className='fixed w-500 h-full overflow-y-auto bg-gray-200 dark:bg-gray-800 dark:text-gray-200 p-8 shadow-lg'>
      <div className='max-w-lg mx-auto'>
        <h2 className='text-lg font-bold mb-4'>Testing Prompt</h2>
        <div className='mb-4'>
          <label className='block text-sm font-bold mb-2 text-gray-900 dark:text-gray-100'>
            Selected System Prompt
          </label>
          <textarea
            className='w-full p-3 border border-gray-300 rounded dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100'
            rows={8}
            name='systemPrompt'
            value={systemPrompt}
            onChange={handleSystemPromptChange}
          />
        </div>
        <div className='mb-4'>
          <label className='block text-sm font-bold mb-2 text-gray-900 dark:text-gray-100'>
            Selected User Prompt
          </label>
          <textarea
            className='w-full p-3 border border-gray-300 rounded dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100'
            rows={8}
            name='userPrompt'
            value={userPrompt}
            onChange={handleUserPromptChange}
          />
        </div>
        <div className='flex justify-end'>
          <Button
            type='button'
            buttonStyle='primary'
            className='font-bold rounded-sm'
            onClick={handleSubmit}
          >
            Test
          </Button>
          <Button buttonStyle='secondary' className='font-bold rounded-sm ml-2' onClick={onClose}>
            Close
          </Button>
        </div>
        <div className='mb-4'>
          <label className='block text-sm font-bold mb-2 text-gray-900 dark:text-gray-100'>
            Test Result
          </label>
          <div className='w-full p-3 border border-gray-300 rounded dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100'>
            {resultOfPrompts}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPrompt;
