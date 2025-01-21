import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import Icon from "src/components/base/Icon";
import LeadTab from "./Lead";
import SequenceTab from "./Sequence";
import SummarizeTab from "./Summarize";
import { IWorkflowTemplate } from "src/utils/types/social-selling";
import { authSelector } from "src/store/Auth";
import { paths } from "src/routes/path";
import { useAppSelector } from "src/hook/redux/useStore";
import Button from "src/components/base/Button";
import { extensionUrl } from "../Builder/TemplateFormOptions";
import { format } from "date-fns";

const AutomationCreatePage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<number>();
  const [currentTemplate, setCurrentTemplate] = useState<string>();
  const [leadTemplateName, setLeadTemplateName] = useState<string>();
  const [linkedinWorkflowTemplate, setLinkedinWorkflowTemplate] = useState<IWorkflowTemplate>();
  const [workflowId, setWorkflowId] = useState();
  const [summerWorkflowId, setSummerWorkflowIdWorkflowId] = useState();
  const [workflowTemplate, setWorkflowTemplate] = useState<IWorkflowTemplate>();
  const [openBuilderPage, setOpenBuilderPage] = useState(false);

  const [startMethod, setStartMethod] = useState<string>("");

  const { cookieInfo, linkedinConnectionStatus } = useAppSelector(authSelector);
  const [shouldDisplayError, setShouldDisplayError] = useState(true);

  const { state } = useLocation();
  const isAisdrSetupLanding = state?.isAisdrSetupLanding || false;
  const aisdrData = state?.aisdrData;
  // let workflowId = state?.workflowId;
  useEffect(() => {
    // console.log("increate " + workflowId);
    if (!workflowId) {
      setWorkflowId(state?.workflowId);
    }
    if (startMethod === "scratch") {
      setWorkflowId(undefined);
      setCurrentTemplate(undefined);
      setLeadTemplateName(undefined);
      setLinkedinWorkflowTemplate(undefined);
      setSummerWorkflowIdWorkflowId(undefined);
      setWorkflowTemplate(undefined);
    }
    if (startMethod === "aisdr-setup") {
      setWorkflowId(undefined);
      setCurrentTemplate(undefined);
      setLeadTemplateName(undefined);
      setLinkedinWorkflowTemplate(undefined);
      setSummerWorkflowIdWorkflowId(undefined);
      setWorkflowTemplate(undefined);
    }
    if (startMethod === "visited") {
      setWorkflowId(undefined);
    }
    if (openBuilderPage && summerWorkflowId) {
      // console.log("open builder" + summerWorkflowId);
      setStartMethod("");
      setOpenBuilderPage(false);
      setCurrentTab(1);
    }
  }, [
    workflowId,
    startMethod,
    openBuilderPage,
    summerWorkflowId,
    currentTemplate,
    leadTemplateName,
    linkedinWorkflowTemplate,
    // workflowTemplate,
  ]);

  useEffect(() => {
    // console.log("increate---" + summerWorkflowId);
  }, [currentTab]);

  const steps = [
    { name: "Add Leads", value: 0 },
    { name: "Create a sequence", value: 1 },
    { name: "Launched", value: 2 },
  ];

  useEffect(() => {
    if (state?.builder) {
      setCurrentTab(1);
    } else {
      setCurrentTab(0);
    }
  }, [state, leadTemplateName]);

  useEffect(() => {
    if (isAisdrSetupLanding) {
      setWorkflowId(undefined);
      setCurrentTemplate(undefined);
      setLeadTemplateName(undefined);
      setLinkedinWorkflowTemplate(undefined);
      setSummerWorkflowIdWorkflowId(undefined);
      setWorkflowTemplate(undefined);
      setStartMethod("aisdr-setup");
      setCurrentTab(1);
    }
  }, []);

  const handleExtensionClick = async () => {
    window.open(extensionUrl, "_blank");
  };

  return (
    <>
      <div>
        {/* <Link
          onClick={() => {
            setWorkflowId(undefined);
            setCurrentTemplate(undefined);
            setLeadTemplateName(undefined);
            setLinkedinWorkflowTemplate(undefined);
            setSummerWorkflowIdWorkflowId(undefined);
            setWorkflowTemplate(undefined);
          }}
          to={paths.main.automation.index}
          className='flex items-center gap-4 pb-4 text-neutral-800 dark:text-neutral-300'
        >
          <Icon name='ArrowLeft' className='w-20 h-20' />
          <p>Automations</p>
        </Link> */}
        <div
          className={`flex items-center justify-between gap-16 ${
            currentTab === 1 ? "max-w-1140" : "max-w-1140"
          }`}
        >
          <h2 className='font-normal select-none text-25 text-neutral-800 dark:text-neutral-300'>
            Create Automations
          </h2>
          {linkedinConnectionStatus && Object.keys(linkedinConnectionStatus).length !== 0 ? (
            <div className='text-center'>
              <p
                className={`text-white px-12 py-4 rounded-full ${
                  linkedinConnectionStatus.connected
                    ? "dark:bg-green-600 bg-green-500"
                    : "dark:bg-red-600 bg-red-500"
                }`}
              >
                {linkedinConnectionStatus.connected ? (
                  `Linkedin Integration Last Check ${format(
                    new Date(linkedinConnectionStatus.last_updated_at),
                    "yyyy-MM-dd HH:mm:ss"
                  )}`
                ) : (
                  <div className='flex text-center justify-center'>Please Integrate Linkedin</div>
                )}
                {/* ? "Cookie Expired"
                : `Cookie Active updated ${cookieInfo.cookie_last_updated_at}`} */}
              </p>
            </div>
          ) : null}
        </div>
      </div>
      <div
        className={`flex items-center justify-between pt-10 border-b border-borderColor dark:border-borderColor-dark ${
          currentTab === 1 ? "max-w-1140" : "max-w-1140"
        }`}
      >
        <nav className='grid justify-between w-full grid-cols-3 text-30'>
          {steps.map((step) => (
            <div
              key={step.name}
              className={`whitespace-nowrap border-b-2 py-16 px-1 text-sm font-medium flex justify-center ${
                step?.value === currentTab
                  ? "border-primary text-primary "
                  : "border-transparent text-neutral-600 dark:text-neutral-400"
              }`}
            >
              <p className='text-18'>{step.name}</p>
            </div>
          ))}
        </nav>
      </div>
      {currentTab === 0 && (
        <LeadTab
          setTemplateName={setLeadTemplateName}
          setCurrentTemplate={setCurrentTemplate}
          setLinkedinWorkflowTemplate={setLinkedinWorkflowTemplate}
          onNextTab={(target: string) => {
            if (target == "scratch") {
              setWorkflowId(undefined);
              setCurrentTemplate(undefined);
              setLeadTemplateName(undefined);
              setLinkedinWorkflowTemplate(undefined);
              setSummerWorkflowIdWorkflowId(undefined);
              setWorkflowTemplate(undefined);
            }
            setStartMethod(target);
            setCurrentTab(1);
            setLinkedinWorkflowTemplate(linkedinWorkflowTemplate);
          }}
        />
      )}
      {currentTab === 1 && (
        <SequenceTab
          startMethod={startMethod}
          setCurrentTemplate={setCurrentTemplate}
          currentTemplate={currentTemplate}
          workflowId={workflowId}
          summerWorkflowId={summerWorkflowId}
          rWorkflowTemplate={linkedinWorkflowTemplate}
          leadTemplateName={leadTemplateName}
          setSummerWorkflowId={setSummerWorkflowIdWorkflowId}
          onNextTab={(val: IWorkflowTemplate) => {
            setWorkflowTemplate(val);
            setCurrentTab(2);
          }}
          onBackTab={() => setCurrentTab(0)}
          aisdrData={aisdrData}
        />
      )}
      {currentTab === 2 && (
        <SummarizeTab
          workflowTemplate={workflowTemplate}
          onBackTab={(val: any) => {
            setOpenBuilderPage(true);
            setWorkflowId(val);
            setSummerWorkflowIdWorkflowId(val);
            // console.log("onback tabl workflowid " + val);
          }}
        />
      )}
    </>
  );
};

export default AutomationCreatePage;
