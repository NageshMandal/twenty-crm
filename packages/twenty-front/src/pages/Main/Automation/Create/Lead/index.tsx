import React, { useState } from "react";

import Button from "src/components/base/Button";
import FromLead from "./FromLead";
import FromLinkedin from "./FromLinkedin";
import FromVisitor from "./FromVisitor";
import Icon, { IconType } from "src/components/base/Icon";
import { v4 as uuidv4 } from "uuid";
import FromPostCommenters from "./FromPostCommenters";
import FromPostLikers from "./FromPostLikers";

type TBlock = {
  icon: IconType;
  description: string;
  value: number;
};

type Props = {
  onNextTab: Function;
  setTemplateName: Function;
  setCurrentTemplate: Function;
  setLinkedinWorkflowTemplate: Function;
};

const blocks: TBlock[] = [
  { icon: "Earth", description: "From Scratch", value: 4 },
  { icon: "Template", description: "From Template", value: 5 },
  { icon: "ThreeBar", description: "From my Leads", value: 1 },
  // { icon: "Visitor", description: "From Website Visitor", value: 2 },
  { icon: "Link2", description: "From LinkedIn Search or List", value: 3 },
  { icon: "Link2", description: "From Linkedin Post Commenters", value: 7 },
  { icon: "Link2", description: "From Linkedin Post Likes", value: 8 },
  { icon: "Visitor", description: "From Website Visitor", value: 6 },
];

const LeadTab: React.FC<Props> = ({
  onNextTab,
  setTemplateName,
  setCurrentTemplate,
  setLinkedinWorkflowTemplate,
}) => {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [currentMethod, setCurrentMethod] = useState(0);

  return (
    <div className='relative'>
      {currentScreen === 0 && (
        <div>
          <div className='flex items-center gap-12 py-30'>
            <div className='p-12 overflow-hidden bg-primary-2 rounded-xl'>
              <Icon name='UserPlus' className='w-20 h-20 text-white' />
            </div>
            <p className='font-normal text-neutral-800 dark:text-neutral-300 text-24'>
              How do you want to add your prospects?
            </p>
          </div>
          <div className='flex flex-wrap items-center justify-center gap-30'>
            {blocks.map((item) => (
              <div
                key={item.icon}
                className='relative flex items-center justify-center transition-all duration-200 border-2 cursor-pointer rounded-2xl w-300 h-210 border-primary-1 hover:brightness-90'
                onClick={() => {
                  if (item.value === 4) {
                    setTemplateName(undefined);
                    setCurrentTemplate(undefined);
                    setLinkedinWorkflowTemplate(undefined);
                    setCurrentScreen(0);
                    setCurrentMethod(4);
                  } else if (item.value === 5) {
                    setCurrentScreen(0);
                    setCurrentMethod(5);
                  } else if (item.value === 6) {
                    setCurrentScreen(6);
                    setCurrentMethod(6);
                  } else if (item.value === 7) {
                    setCurrentScreen(7);
                    setCurrentMethod(7);
                  } else if (item.value === 8) {
                    setCurrentScreen(8);
                    setCurrentMethod(8);
                  } else {
                    setCurrentScreen(item.value);
                  }
                }}
              >
                {currentMethod === item.value && (
                  <Icon
                    name='CheckRing'
                    className='absolute top-8 right-8 w-30 h-30 text-success-1'
                  />
                )}
                <div className='flex flex-col items-center justify-center gap-14'>
                  <div className='w-56 h-56 p-10 overflow-hidden rounded-md bg-primary-1'>
                    <Icon name={item.icon} className='w-full h-full text-white'></Icon>
                  </div>
                  <p className='flex font-semibold text-16 text-neutral-900 dark:text-neutral-300'>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className='flex justify-center gap-20 pt-90 '>
            <Button className='w-125' buttonStyle='secondary' onClick={() => setCurrentMethod(0)}>
              Back
            </Button>
            <Button
              className='w-125'
              disabled={currentMethod === 0}
              onClick={() => {
                const target =
                  currentMethod === 4 ? "scratch" : currentMethod === 5 ? "template" : "";
                onNextTab(target);
              }}
            >
              Next
            </Button>
          </div>
        </div>
      )}
      {currentScreen === 1 && (
        <FromLead
          onBack={() => setCurrentScreen(0)}
          onNext={async () => {
            await setTemplateName("My Contacts");
            onNextTab("lead");
          }}
        />
      )}
      {currentScreen === 6 && (
        <FromVisitor
          onBack={() => setCurrentScreen(0)}
          // onNext={() => {
          //   setCurrentScreen(0);
          //   setCurrentMethod(2);
          // }}
          onNext={async () => {
            await setTemplateName("Visited Website");
            onNextTab("lead");
          }}
        />
      )}
      {currentScreen === 3 && (
        <FromLinkedin
          setLinkedinWorkflowTemplate={setLinkedinWorkflowTemplate}
          onBack={() => setCurrentScreen(0)}
          onNext={() => {
            onNextTab("linkedin");
          }}
        />
      )}
      {currentScreen === 7 && (
        <FromPostCommenters
          onBack={() => setCurrentScreen(0)}
          onNext={async () => {
            await setTemplateName("Linkedin Post Commenters");
            onNextTab("lead");
          }}
        />
      )}
      {currentScreen === 8 && (
        <FromPostLikers
          onBack={() => setCurrentScreen(0)}
          onNext={async () => {
            await setTemplateName("Linkedin Post Likes");
            onNextTab("lead");
          }}
        />
      )}
    </div>
  );
};

export default LeadTab;
