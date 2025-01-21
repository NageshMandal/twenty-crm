import React, { useState } from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

import Button from "src/components/base/Button";
import Icon from "src/components/base/Icon";
import Input from "src/components/base/Input";
import ReactSelect from "src/components/base/ReactSelect";
import { ISelectOption } from "src/utils/types";
import { autoStopOptions, scheduleRoot } from "../../Builder/TemplateFormOptions";
import Switch from "src/components/base/Switch";

type Props = {
  onNext: Function;
  onBack: Function;
  setLinkedinWorkflowTemplate: Function;
};
const node1UId = uuidv4();
const node2UId = uuidv4();
const newName = new Date().toLocaleString("en-US", {
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  hour12: true, // Include AM/PM format
});
const linkedinWorkflow = {
  name: newName,
  tag: "",
  id: null,
  flowchart: [
    // LinkedIn Sales Navigator List Node
    {
      choosenFunction: "linkedin",
      content: {
        value: "",
      },
      id: node1UId, // Unique ID for the node
      prevNode: null, // No previous node
    },
    {
      choosenFunction: "timer",
      content: {
        value: "Delay",
        delayUnit: {
          value: "Days",
          label: "Days",
        },
        delayValue: "2",
      },
      id: node2UId, // Unique ID for the node
      prevNode: node1UId, // No previous node
    },
  ],
};

const FromLinkedin: React.FC<Props> = ({ onNext, onBack, setLinkedinWorkflowTemplate }) => {
  const [linkedinURL, setLinkedinURL] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [templateName, setTemplateName] = useState(newName);
  const [profileNumber, setProfileNumber] = useState("100");

  const [selectedStopCondition, setSelectedStopCondition] = useState<ISelectOption>();
  const [selectedTime, setSelectedTime] = useState<ISelectOption>();

  const handleUrl = async (e: any) => {
    const searchURL = e.target.value;
    setLinkedinURL(searchURL);
    const updatedWorkflow = { ...linkedinWorkflow };
    if (searchURL.startsWith("https://www.linkedin.com/sales/search/")) {
      updatedWorkflow.flowchart[0].content.value = "Linkedin Sales Navigator Search Extractor";
      (updatedWorkflow.flowchart[0].content as any).searchURL = searchURL;
      // (updatedWorkflow.flowchart[0].content as any).profileNumber = "100";
      (updatedWorkflow.flowchart[0].content as any).profileNumber = profileNumber;
      setIsFormValid(true);
    } else if (searchURL.startsWith("https://www.linkedin.com/sales/search/")) {
      updatedWorkflow.flowchart[0].content.value =
        "AISDR Linkedin Sales Navigator Search Extractor";
      (updatedWorkflow.flowchart[0].content as any).searchURL = searchURL;
      // (updatedWorkflow.flowchart[0].content as any).profileNumber = "100";
      (updatedWorkflow.flowchart[0].content as any).profileNumber = profileNumber;
      setIsFormValid(true);
    } else if (searchURL.startsWith("https://www.linkedin.com/sales/lists/")) {
      updatedWorkflow.flowchart[0].content.value = "Linkedin Sales Navigator List";
      (updatedWorkflow.flowchart[0].content as any).searchURL = searchURL;
      (updatedWorkflow.flowchart[0].content as any).profileNumber = profileNumber;
      setIsFormValid(true);
    } else if (searchURL.startsWith("https://www.linkedin.com/search/")) {
      updatedWorkflow.flowchart[0].content.value = "Linkedin Search Extractor";
      (updatedWorkflow.flowchart[0].content as any).link = searchURL;
      (updatedWorkflow.flowchart[0].content as any).extractProfileNumber = profileNumber;
      setIsFormValid(true);
    } else if (searchURL.startsWith("https://www.linkedin.com/groups/")) {
      updatedWorkflow.flowchart[0].content.value = "Linkedin Group Extractor";
      (updatedWorkflow.flowchart[0].content as any).groupUrl = searchURL;
      (updatedWorkflow.flowchart[0].content as any).numberOfMembers = profileNumber;
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }

    setLinkedinWorkflowTemplate(updatedWorkflow);
  };

  const handleProfileNumbers = async (e: any) => {
    const pN = e.target.value;
    const searchURL = linkedinURL;
    setProfileNumber(pN);
    const updatedWorkflow = { ...linkedinWorkflow };
    if (searchURL.startsWith("https://www.linkedin.com/sales/search/")) {
      (updatedWorkflow.flowchart[0].content as any).profileNumber = pN;
      setIsFormValid(true);
    } else if (searchURL.startsWith("https://www.linkedin.com/sales/lists/")) {
      (updatedWorkflow.flowchart[0].content as any).profileNumber = pN;
      setIsFormValid(true);
    } else if (searchURL.startsWith("https://www.linkedin.com/search/")) {
      (updatedWorkflow.flowchart[0].content as any).extractProfileNumber = pN;
      setIsFormValid(true);
    } else if (searchURL.startsWith("https://www.linkedin.com/groups/")) {
      (updatedWorkflow.flowchart[0].content as any).numberOfMembers = pN;
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
    setLinkedinWorkflowTemplate(updatedWorkflow);
  };

  const handleName = async (e: any) => {
    setTemplateName(e.target.value);
    const updatedWorkflow = { ...linkedinWorkflow };
    updatedWorkflow.name = e.target.value;
  };
  const handleNext = async () => {
    if (isFormValid) {
      onNext();
    } else {
      toast.warn("Enter a valid Linkedin URL");
    }
  };

  const handleStopSelectChangeValue = (option: ISelectOption) => {
    setSelectedStopCondition(option);
    const updatedWorkflow = { ...linkedinWorkflow };
    (updatedWorkflow.flowchart[0].content as any).autoStopCondition = {
      label: option.label,
      value: option.value,
    };
    setLinkedinWorkflowTemplate(updatedWorkflow);
  };

  const handleTimeSelectChange = (option: ISelectOption) => {
    setSelectedTime(option);
    const updatedWorkflow = { ...linkedinWorkflow };
    (updatedWorkflow.flowchart[0].content as any).schedulesOptions = {
      label: option.label,
      value: option.value,
    };
    setLinkedinWorkflowTemplate(updatedWorkflow);
  };
  return (
    <div className='w-full'>
      <div className='flex items-center gap-12 py-30 w-full'>
        <div className='p-12 overflow-hidden bg-primary-2 rounded-xl'>
          <Icon name='UserPlus' className='w-20 h-20 text-white' />
        </div>
        <p className='text-neutral-800 dark:text-neutral-300 text-20'>LinkedIn select Url type</p>
      </div>
      <form className='flex flex-col gap-16 w-500'>
        <Input
          fullWidth
          label='Input url from LinkedIn *'
          placeholder='https://LinkedIn.com/....*'
          onChange={handleUrl}
          value={linkedinURL}
        />
        <Input
          fullWidth
          type='number'
          label='Number of Prospects *'
          placeholder='100'
          onChange={handleProfileNumbers}
          value={profileNumber}
        />
        <Input
          fullWidth
          label='Assign List Name after download:'
          placeholder='Sales Directors NYC'
          value={templateName}
          onChange={handleName}
        />
        <ReactSelect
          label='On Reply stop follow up or keep going?'
          placeholder='Select an option'
          options={autoStopOptions}
          value={selectedStopCondition}
          onChange={handleStopSelectChangeValue}
        />
        <ReactSelect
          label='Schedule (timezone)'
          placeholder='Select an option'
          options={scheduleRoot}
          value={selectedTime}
          onChange={handleTimeSelectChange}
        />
        <div className='flex gap-12 pt-10 items-center justify-center'>
          <Button className='w-130' buttonStyle='secondary' onClick={() => onBack()}>
            Back
          </Button>
          <Button onClick={handleNext}>Save and Next</Button>
        </div>
      </form>
    </div>
  );
};

export default FromLinkedin;
