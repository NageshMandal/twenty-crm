import React, { useEffect, useState } from "react";
import { RiSave3Line } from "react-icons/ri";
import { toast } from "react-toastify";

import Button from "src/components/base/Button";
import Congratulation from "./Congratulation";
import Icon from "src/components/base/Icon";
import Input from "src/components/base/Input";
import axios from "src/utils/functions/axios";
import { IWorkflowTemplate } from "src/utils/types/social-selling";
import ReactLoading from "react-loading";
import AutomationSettingModal from "src/components/base/AutomationSettingModal";
import { ISelectOption } from "src/utils/types";
import { FieldValues, useForm, useWatch } from "react-hook-form";
import { autoStopOptions, scheduleRoot } from "../../Builder/TemplateFormOptions";
import { useTags } from "src/hook/lead/useTags";
import { ILeadTag } from "src/utils/types/leads";
import Switch from "src/components/base/Switch";

type Props = {
  workflowTemplate?: IWorkflowTemplate;
  onBackTab: Function;
};

const SummarizeTab: React.FC<Props> = ({ workflowTemplate, onBackTab }) => {
  const [workflowStatus, setWorkflowStatus] = useState(workflowTemplate?.status);
  const [workflowName, setWorkflowName] = useState(workflowTemplate?.name);
  const [isChangeWorkflowName, setIsChangeWorkflowName] = useState(false);
  const [workflowId, setWorkflowId] = useState(workflowTemplate?.id);
  const [isStartWorkflowPending, setisStartWorkflowPending] = useState(false);
  const [isNameSaving, setIsNameSaving] = useState(false);
  const [showSettingModal, setIsShowSettingModal] = useState(false);
  const [isSettingModalLoading, setIsSettingModalLoading] = useState(false);
  const [selectedStopCondition, setSelectedStopCondition] = useState<ISelectOption>();
  const [selectedTime, setSelectedTime] = useState<ISelectOption>(null);
  const [isSavingBothSettings, setIsSavingBothSettings] = useState(false);

  const [currentScreen, setCurrentScreen] = useState(0);

  const { control, watch, handleSubmit, setValue } = useForm<any>({
    defaultValues: {
      shouldFindEmailsSwitch: true, // Set your default value here
      syncToHubspot: false, // Provide a default value
      syncToPipedrive: false, // Provide a default value
    },
  });
  const { tags } = useTags();
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [filteredTags, setFilteredTags] = useState<ILeadTag[]>([]);
  const shouldFindEmails = useWatch({
    control,
    name: "shouldFindEmailsSwitch",
    defaultValue: true,
  });

  const syncToHubspotValue = watch("syncToHubspot");
  const syncToPipedriveValue = watch("syncToPipedrive");

  const handleSaveWorkflowName = async () => {
    setIsNameSaving(true);
    //some handler
    try {
      // arrangeNodes();
      workflowTemplate.name = workflowName;
      workflowTemplate.tag = inputValue;
      workflowTemplate.flowchart[0].content.should_find_emails = shouldFindEmails ?? true;
      await axios(true).post(
        `${process.env.REACT_APP_WORKFLOW_API_URL}/workflow/${workflowTemplate.id}/update`,
        JSON.stringify(workflowTemplate),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Workflow Name updated successfully!");
      setIsChangeWorkflowName(false);
      setIsNameSaving(false);
      return true;
    } catch (error) {
      toast.error("Failed to save workflow name. Please try again.");
      console.error("Failed to save workflow name." + error);
      setIsChangeWorkflowName(false);
      setIsNameSaving(false);
      return false;
    }
    // setIsChangeWorkflowName(false);
  };

  useEffect(() => {
    setWorkflowId(workflowTemplate?.id);
    if (workflowTemplate.name) {
      setWorkflowName(workflowTemplate.name);
    }
  }, [workflowTemplate]);

  useEffect(() => {
    if (inputValue) {
      const filtered = tags.filter((tag) =>
        tag.name.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredTags(filtered);
    } else {
      setFilteredTags([]);
    }
  }, [inputValue, tags]);

  const handleStartAutomationClick = async () => {
    setisStartWorkflowPending(true);
    await handleSaveWorkflowName();
    // setCurrentScreen(1);
    if (workflowTemplate) {
      if (!workflowStatus || workflowStatus === "paused" || workflowStatus === "created") {
        try {
          workflowTemplate.tag = inputValue;
          workflowTemplate.flowchart[0].content.should_find_emails = shouldFindEmails ?? true;
          console.log("workflowTemplate: " + JSON.stringify(workflowTemplate));
          const response = await axios(true).get(
            `${process.env.REACT_APP_WORKFLOW_API_URL}/workflow/${workflowTemplate?.id}/process`,
            {}
          );
          const receiveData = response.status.toString();
          if (receiveData === "success") {
            toast.success("Workflow started successfully!");
            setCurrentScreen(1);
            setWorkflowStatus("processing");
            workflowTemplate.status = "processing";
            setisStartWorkflowPending(false);
            return true;
          } else {
            // Handle errors
            toast.error("Failed to start workflow. Please try again.");
            setisStartWorkflowPending(false);
            return false;
          }
        } catch (error) {
          // Handle network errors
          console.error("Error start workflow: ", error);
          // toast.error("Failed to start workflow: " + error);
          if (error.response && error.response.data && error.response.data.error) {
            const errorMessage = error.response.data.error;
            toast.error("Failed to start workflow: " + errorMessage);
          }
          setisStartWorkflowPending(false);
          return false;
        }
      } else if (workflowStatus == "processing") {
        try {
          const response = await axios(true).post(
            `${process.env.REACT_APP_WORKFLOW_API_URL}/workflow/${workflowTemplate?.id}/pause`,
            {}
          );
          const receiveData = response.data.status.toString();
          if (receiveData === "paused") {
            setWorkflowStatus("paused");
            workflowTemplate.status = "paused";
            toast.success("Workflow paused successfully!");
            setisStartWorkflowPending(false);
            return true;
          } else {
            // Handle errors
            toast.error("Failed to pause workflow. Please try again.");
            setisStartWorkflowPending(false);
            return false;
          }
        } catch (error) {
          // Handle network errors
          console.error("Error pause workflow:", error);
          toast.error("Failed to pause workflow." + error);
          setisStartWorkflowPending(false);
          return false;
        }
      }
    }
  };

  const handleStopSelectChangeValue = async (option: any) => {
    setSelectedStopCondition(option);
  };

  const handleTimeSelectChange = async (option: ISelectOption) => {
    setSelectedTime(option);
  };

  const onSettingSubmit = async (formData: FieldValues) => {
    // console.log("formData", JSON.stringify(formData));
    setIsSavingBothSettings(true);
    const syncToH = formData.syncToHubspot ? 1 : 0;
    const syncToP = formData.syncToPipedrive ? 1 : 0;
    const option = selectedStopCondition;
    try {
      let toSend = `remove_prospect_on_li_reply=${1}&remove_prospect_on_email_reply=${1}`;
      if (option.value === "nothing") {
        toSend = `remove_prospect_on_li_reply=${0}&remove_prospect_on_email_reply=${0}`;
      } else if (option.value === "email") {
        toSend = `remove_prospect_on_li_reply=${0}&remove_prospect_on_email_reply=${1}`;
      } else if (option.value === "linkedin") {
        toSend = `remove_prospect_on_li_reply=${1}&remove_prospect_on_email_reply=${0}`;
      } else if (option.value === "bothCounts") {
        toSend = `remove_prospect_on_li_reply=${1}&remove_prospect_on_email_reply=${1}`;
      }

      const response = await axios(true).put(
        `${process.env.REACT_APP_WORKFLOW_API_URL}/workflow/${workflowTemplate?.id}/settings?${toSend}`,
        {}
      );
      const response2 = await axios(true).put(
        `${process.env.REACT_APP_WORKFLOW_API_URL}/workflow/${workflowTemplate?.id}/settings`,
        {
          schedule_id: selectedTime.value ?? null,
          sync_to_hubspot_on_reply: syncToH,
          sync_to_pipedrive_on_reply: syncToP,
        }
      );
      const receiveData = response.status.toString();
      if (receiveData === "success") {
        toast.success("Condition Setting saved successfully!");
      }
      if (response2.status.toString() === "success") {
        toast.success("Sync Setting saved successfully!");
      }
    } catch (error) {
      toast.error(error?.message);
    }
    setIsSavingBothSettings(false);
  };

  const setSyncToHubspot = (value) => {
    setValue("syncToHubspot", value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const setSyncToPipedrive = (value) => {
    setValue("syncToPipedrive", value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleSettingClicked = async () => {
    setIsSettingModalLoading(true);
    try {
      const response = await axios(true).get(
        `${process.env.REACT_APP_WORKFLOW_API_URL}/workflow/${workflowTemplate?.id}/settings`,
        {}
      );
      const recivedData = response as any;
      if (recivedData.status == "success") {
        const rTime = scheduleRoot.find((item) => {
          return item.value == recivedData?.data?.schedule_id;
        });
        let rCondition = "bothCounts";
        if (
          recivedData?.data?.remove_prospect_on_li_reply == 0 &&
          recivedData?.data.remove_prospect_on_email_reply == 0
        ) {
          rCondition = "nothing";
        } else if (
          recivedData?.data?.remove_prospect_on_li_reply == 1 &&
          recivedData?.data.remove_prospect_on_email_reply == 0
        ) {
          rCondition = "linkedin";
        } else if (
          recivedData?.data?.remove_prospect_on_li_reply == 0 &&
          recivedData?.data.remove_prospect_on_email_reply == 1
        ) {
          rCondition = "email";
        } else if (
          recivedData?.data?.remove_prospect_on_li_reply == 1 &&
          recivedData?.data.remove_prospect_on_email_reply == 1
        ) {
          rCondition = "bothCounts";
        }
        const rAssignCondition = autoStopOptions.find((item) => {
          return item.value == rCondition;
        });
        setSelectedTime(rTime);
        setSelectedStopCondition(rAssignCondition);
        setSyncToHubspot(recivedData?.data?.sync_to_hubspot_on_reply);
        setSyncToPipedrive(recivedData?.data?.sync_to_pipedrive_on_reply);
      }
    } catch (error) {
      toast.error(error?.message);
    }
    setIsSettingModalLoading(false);
    setIsShowSettingModal(true);
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag);
    setInputValue(tag);
    setFilteredTags([]);
  };

  return (
    <>
      {currentScreen === 0 ? (
        <>
          <AutomationSettingModal
            show={showSettingModal}
            onClose={() => setIsShowSettingModal(false)}
            selectedStopCondition={selectedStopCondition}
            setSelectedStopCondition={setSelectedStopCondition}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            handleStopSelectChangeValue={handleStopSelectChangeValue}
            handleTimeSelectChange={handleTimeSelectChange}
            control={control}
            handleSubmit={handleSubmit}
            onSettingSubmit={onSettingSubmit}
            isSavingBothSettings={isSavingBothSettings}
          ></AutomationSettingModal>
          <div className='flex items-center gap-12 py-30'>
            <div className='p-12 overflow-hidden bg-primary-2 rounded-xl'>
              <Icon name='UserPlus' className='w-20 h-20 text-white' />
            </div>
            <p className='font-normal text-neutral-800 dark:text-neutral-300 text-24'>
              Automation: {workflowTemplate.name} is ready
            </p>
          </div>
          <div className='grid w-full grid-cols-12 pt-16 divide-x-2 max-w-1100 divide-borderColor dark:divide-borderColor-dark'>
            <div className='flex items-center justify-between col-span-5 pr-25'>
              <div className='flex items-center gap-12'>
                <div className='space-y-6 font-medium'>
                  <div className='flex items-center gap-10'>
                    <Input
                      className='!py-4'
                      value={workflowName ?? ""}
                      onChange={(event) => {
                        setWorkflowName(event?.target?.value);
                        setIsChangeWorkflowName(true);
                      }}
                    />
                    {isChangeWorkflowName && isNameSaving ? (
                      <ReactLoading type='bars' width={24} height={21} color={"#2285E1"} />
                    ) : (
                      <RiSave3Line
                        color={"#2285E1"}
                        onClick={() => handleSaveWorkflowName()}
                        className='w-24 h-24 transition-colors duration-100 cursor-pointer text-neutral-600 dark:text-neutral-500 hover:text-neutral-700 hover:dark:text-neutral-400'
                      />
                    )}
                  </div>
                  <p className='text-neutral-500 text-12'>
                    {workflowTemplate?.data?.status || "DRAFT"}
                  </p>
                  <div className='my-8 py-8'>
                    <p className='text-neutral-700 dark:text-neutral-400'>
                      Assign a Tag to Help Recognize Prospects Later
                    </p>
                    <span className='mt-2 pt-2'></span>
                    <Input
                      className='border rounded-md p-2'
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder='Type to search or select a tag'
                    />
                    {filteredTags.length > 0 && (
                      <ul className='border rounded-md bg-white shadow-lg mt-1'>
                        {filteredTags.map((tag) => (
                          <li
                            key={tag.name}
                            className='p-2 cursor-pointer hover:bg-gray-200'
                            onClick={() => {
                              handleTagSelect(tag.name);
                              setFilteredTags([]);
                            }}
                          >
                            {tag.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className='my-8 py-8'>
                    <p className='py-4 text-neutral-700 dark:text-neutral-400'>
                      Email Finder Helps find email for Prospects ( but it will take extra time
                      before you are able to see your leads )
                    </p>
                    <Switch
                      control={control}
                      name='shouldFindEmailsSwitch'
                      prefixLabel='Email Finder'
                    />
                  </div>
                </div>
              </div>
              <div className='text-neutral-800 dark:text-neutral-300'>
                {/* <div className='flex items-center gap-10'>
                  <Icon name='ThreeBarLeft' className='w-20 h-20' />
                  <p className='font-medium text-18'>0</p>
                </div>
                <p className='text-14'>Lists of leads</p> */}
              </div>
            </div>
            <div className='flex justify-center col-span-3 gap-30 px-4 text-center'>
              {/* <div className='text-neutral-800 dark:text-neutral-300'>
                <p className='font-medium text-18'>0%</p>
                <p className='text-14'>Lists of leads</p>
              </div> */}
              <div className='text-neutral-800 dark:text-neutral-300'>
                {/* <p className='font-medium text-18'>0%</p> */}
                {/* <p className='text-14'>Lists of leads</p> */}
                <p className='text-14 px-4'>We are Ready, Lets Start the Automation</p>
              </div>
            </div>
            <div className=' items-center justify-center col-span-4 gap-30'>
              {/* <div className='text-neutral-800 dark:text-neutral-300'>
                <p className='text-15 '>Aug 5, 2023</p>
                <p className='text-14'>Lists of leads</p>
              </div> */}
              <div className='flex items-center justify-center'>
                <Button
                  onClick={handleStartAutomationClick}
                  isPending={isStartWorkflowPending}
                  disabled={isStartWorkflowPending}
                >
                  {!workflowStatus || workflowStatus === "paused" || workflowStatus === "created"
                    ? "Start"
                    : "Pause"}{" "}
                  Automation
                </Button>
              </div>
              <div className='flex items-center justify-center pt-10'>
                <Button
                  prefix='Setting3'
                  onClick={() => {
                    handleSettingClicked();
                    // setIsShowSettingModal(true);
                  }}
                  isPending={isSettingModalLoading}
                  disabled={isSettingModalLoading}
                >
                  Settings
                </Button>
              </div>
            </div>
          </div>
          <div className='flex justify-center gap-20 pt-90 max-w-1150'>
            <Button
              className='w-125'
              buttonStyle='secondary'
              onClick={() => {
                onBackTab(workflowId);
              }}
            >
              Back
            </Button>
            <Button className='w-125' onClick={() => {}}>
              Finish
            </Button>
          </div>
        </>
      ) : (
        <Congratulation setCurrentScreen={setCurrentScreen} workflowTemplate={workflowTemplate} />
      )}
    </>
  );
};

export default SummarizeTab;
