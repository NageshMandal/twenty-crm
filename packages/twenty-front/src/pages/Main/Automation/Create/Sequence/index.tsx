import React, { useEffect, useState } from "react";

import Builder from "../../Builder";
import Icon from "src/components/base/Icon";
import Message from "./Message";
import Template from "./Template";
import AiSdr from "./AiSdr";
import { IWorkflowTemplate } from "src/utils/types/social-selling";
import {
  automationSelector,
  setResetBuilderMessage,
  setResetBuilderEmail,
} from "src/store/Automation";
import { useAppDispatch, useAppSelector } from "src/hook/redux/useStore";
import Email from "./Email";
import { current } from "@reduxjs/toolkit";

type Props = {
  onBackTab: Function;
  onNextTab: Function;
  workflowId?: number;
  setCurrentTemplate: Function;
  currentTemplate?: string;
  rWorkflowTemplate?: any;
  leadTemplateName?: any;
  startMethod: string;
  summerWorkflowId?: any;
  setSummerWorkflowId?: any;
  aisdrData?: any;
};

const SequenceTab: React.FC<Props> = ({
  onNextTab,
  onBackTab,
  workflowId,
  setCurrentTemplate,
  currentTemplate,
  rWorkflowTemplate,
  leadTemplateName,
  startMethod,
  summerWorkflowId,
  setSummerWorkflowId,
  aisdrData,
}) => {
  // console.log("workflowId in sequance: " + workflowId);
  const [currentStep, setCurrentStep] = useState<number>();
  const { builderMessage } = useAppSelector(automationSelector);
  const { builderEmail } = useAppSelector(automationSelector);
  const { builderAiSdr } = useAppSelector(automationSelector);
  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => {
      dispatch(setResetBuilderMessage());
      dispatch(setResetBuilderEmail());
    };
  }, []);

  useEffect(() => {
    // console.log("startmdthd: " + startMethod);
    if (startMethod === "scratch") {
      setCurrentTemplate(undefined);
      setSummerWorkflowId(undefined);
    }
    if (startMethod === "template") {
      setCurrentStep(1);
    } else {
      setCurrentStep(0);
    }
    if (startMethod === "aisdr-setup") {
      setCurrentTemplate(undefined);
      setSummerWorkflowId(undefined);
    }
  }, [startMethod]);

  useEffect(() => {
    // console.log("seq sum : " + summerWorkflowId);
    if (summerWorkflowId) {
      workflowId = parseInt(summerWorkflowId);
      setCurrentStep(0);
    }
  }, [summerWorkflowId]);

  return (
    <div className='w-100vw relative'>
      {currentStep === 0 ? (
        <div className='flex items-center justify-between pb-20 pt-30 max-w-100vw'>
          <div className='flex items-center gap-6'>
            <Icon name='Exclamation' className='w-20 h-20 text-neutral-800 dark:text-neutral-300' />
            <p className='font-normal text-neutral-800 dark:text-neutral-300 text-14'>
              All leads that reply to your connection request, message or InMail will be put on
              hold, and further actions won't be performed
            </p>
            <p className='pl-4 text-primary text-14'>Lean more</p>
          </div>
          <div className='flex items-center gap-6' role='button' onClick={() => setCurrentStep(1)}>
            <Icon name='ArrowLeft' className='text-primary w-14 h-14' />
            <p className='text-primary text-14'>Back to templates</p>
          </div>
        </div>
      ) : null}
      {currentStep === 1 ? (
        <div className='flex items-center justify-between max-w-1100'>
          <div className='flex items-center gap-12 py-30'>
            <div className='p-12 overflow-hidden bg-primary-2 rounded-xl'>
              <Icon name='UserPlus' className='w-20 h-20 text-white' />
            </div>
            <p className='font-normal text-neutral-800 dark:text-neutral-300 text-24'>
              Choose a template for your automation or build from Scratch
            </p>
          </div>
        </div>
      ) : null}
      {currentStep === 1 ? (
        <Template
          onNextStep={(name: string) => {
            setCurrentStep(0);
            setCurrentTemplate(name);
          }}
        />
      ) : null}
      {currentStep === 0 ? (
        <Builder
          workflowId={workflowId}
          rWorkflowTemplate={rWorkflowTemplate}
          leadTemplateName={leadTemplateName}
          summerWorkflowId={summerWorkflowId}
          startMethod={startMethod}
          onBackTab={() => onBackTab()}
          onNextTab={(val: IWorkflowTemplate) => {
            onNextTab(val);
          }}
          templateName={currentTemplate}
          aisdrData={aisdrData}
        />
      ) : null}
      {builderMessage && builderMessage.id && <Message builderMessage={builderMessage} />}
      {builderEmail && builderEmail.id && <Email builderEmail={builderEmail} />}
      {builderAiSdr && builderAiSdr.id && <AiSdr builderAiSdr={builderAiSdr} />}
    </div>
  );
};

export default SequenceTab;
