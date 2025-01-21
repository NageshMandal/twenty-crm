import React, { useEffect, useState } from "react";
import Avatar from "react-avatar";
import { AiFillExclamationCircle } from "react-icons/ai";
import { useForm, useWatch } from "react-hook-form";

import Button from "src/components/base/Button";
import Icon from "src/components/base/Icon";
import ReactSelectRh from "src/components/base/ReactSelectRh";
import Textarea from "src/components/base/Textarea";
import { IBuilderAiSdr } from "src/utils/types/automation";
import { authSelector } from "src/store/Auth";
import { setResetBuilderAiSdr, setValueBuilderAiSdr } from "src/store/Automation";
import { useAppDispatch, useAppSelector } from "src/hook/redux/useStore";
import { aiSdrVariables } from "src/pages/Main/Automation/Builder/TemplateFormOptions";
import ReactSelect from "src/components/base/ReactSelect";
import Switch from "src/components/base/Switch";

type Props = {
  builderAiSdr?: IBuilderAiSdr;
};

const AiSdr: React.FC<Props> = ({ builderAiSdr }) => {
  const { control, register, setValue } = useForm();
  const dispatch = useAppDispatch();
  const aiSdrPitchCTAId = useWatch({ control, name: "aiSdrPitchCTAId" });
  const textAreaValue1 = useWatch({ control, name: "aiSdrField" });
  const textAreaValue2 = useWatch({ control, name: "aiSdrAdditionalInfoField" });
  const textAreaValueObjections = useWatch({ control, name: "aiSdrObjectionsField" });
  const textAreaValueCompetitions = useWatch({ control, name: "aiSdrCompetitionsField" });
  const aiSdrAutomated = useWatch({ control, name: "aiSdrAutomated" });

  const [isSaved, setIsSaved] = useState(false);

  const { userInfo } = useAppSelector(authSelector);
  const [characterCount1, setCharacterCount] = useState(textAreaValue1?.length || 0);
  const [characterCount2, setCharacterCount2] = useState(textAreaValue2?.length || 0);
  const [characterCountObjections, setCharacterCountObjections] = useState(
    textAreaValueObjections?.length || 0
  );
  const [characterCompetitions, setCharacterCompetitions] = useState(
    textAreaValueCompetitions?.length || 0
  );

  const [isButtonLoading, setIsButtonLoading] = useState(false);

  useEffect(() => {
    setValue("aiSdrField", builderAiSdr?.aiSdrField);
    setValue("aiSdrAdditionalInfoField", builderAiSdr?.aiSdrAdditionalInfoField);
    setValue("aiSdrPitchCTAId", builderAiSdr?.aiSdrPitchCTAId);
    setValue("aiSdrObjectionsField", builderAiSdr?.aiSdrObjectionsField);
    setValue("aiSdrCompetitionsField", builderAiSdr?.aiSdrCompetitionsField);
    setValue("aiSdrAutomated", builderAiSdr?.aiSdrAutomated ?? true);
  }, [builderAiSdr]);
  useEffect(() => {
    if (textAreaValue1?.length) {
      setCharacterCount(textAreaValue1.length);
    }
    if (textAreaValue2?.length) {
      setCharacterCount2(textAreaValue2.length);
    }
    if (textAreaValueObjections?.length) {
      setCharacterCountObjections(textAreaValueObjections.length);
    }
    if (textAreaValueCompetitions?.length) {
      setCharacterCompetitions(textAreaValueCompetitions.length);
    }
  }, [textAreaValue1, textAreaValue2, textAreaValueObjections, textAreaValueCompetitions]);
  const maxLength1 = 300;
  const maxLength2 = 300;
  const maxLengthObjections = 300;
  const maxLengthCompetitions = 300;
  const characterLimit1 = maxLength1 - (characterCount1 || 0);
  const characterLimit2 = maxLength2 - (characterCount2 || 0);
  const characterLimitObjections = maxLength2 - (characterCountObjections || 0);
  const characterLimitCompetitions = maxLength2 - (characterCompetitions || 0);
  const labelOfMessage = "AI SDR";

  const handleSelectChange = (selectedOption) => {
    setValue("aiSdrPitchCTAId", selectedOption?.value);
  };

  useEffect(() => {}, []);

  return (
    <div className='absolute w-1140, inset-0 bg-bodyBgColor dark:bg-bodyBgColor-dark'>
      <div className='flex items-center justify-between max-w-1100'>
        <div className='flex items-center gap-12 py-30'>
          <div className='p-12 overflow-hidden bg-primary-2 rounded-xl'>
            <Icon name='UserPlus' className='w-20 h-20 text-white' />
          </div>
          <p className='font-normal text-neutral-800 dark:text-neutral-300 text-24'>
            {labelOfMessage}
          </p>
        </div>
      </div>
      <div className='px-32 py-26 border rounded-lg border-borderColor dark:border-borderColor-dark'>
        <div className='gap-60'>
          <div className='flex flex-col'>
            <div className='grid grid-cols-2 gap-40'>
              <div className='flex flex-col gap-12'>
                <ReactSelect
                  label='Select CTA'
                  options={aiSdrVariables}
                  placeholder='Select CTA'
                  onChange={handleSelectChange}
                  value={aiSdrVariables.find((item) => item.value === aiSdrPitchCTAId)}
                ></ReactSelect>
                <Textarea
                  label='Pitch'
                  className='min-h-150'
                  placeholder='We are offering best services of sales using ai'
                  register={register("aiSdrField", {
                    onChange: (e: any) => {
                      let currentCount = e.target.value.length;
                      if (currentCount > maxLength1) {
                        e.target.value = e.target.value.slice(0, maxLength1);
                        currentCount = maxLength1;
                      }
                      if (currentCount < 0) {
                        currentCount = 0;
                      }
                      setCharacterCount(currentCount);
                      setIsSaved(false);
                    },
                    maxLength: maxLength1,
                  })}
                />
                <p className='mt-8 title-1 pb-10 text-16'>
                  Characters Limit Remains: {characterLimit1}
                </p>
                <Textarea
                  label='Objections'
                  className='min-h-150'
                  placeholder='We are offering best services of sales using ai'
                  register={register("aiSdrObjectionsField", {
                    onChange: (e: any) => {
                      let currentCount = e.target.value.length;
                      if (currentCount > maxLengthObjections) {
                        e.target.value = e.target.value.slice(0, maxLengthObjections);
                        currentCount = maxLengthObjections;
                      }
                      if (currentCount < 0) {
                        currentCount = 0;
                      }
                      setCharacterCountObjections(currentCount);
                      setIsSaved(false);
                    },
                    maxLength: maxLengthObjections,
                  })}
                />
                <p className='mt-8 title-1 pb-10 text-16'>
                  Characters Limit Remains: {characterLimitObjections}
                </p>
                <Textarea
                  label='Competitions'
                  className='min-h-150'
                  placeholder='We are offering best services of sales using ai as compared to our competitors'
                  register={register("aiSdrCompetitionsField", {
                    onChange: (e: any) => {
                      let currentCount = e.target.value.length;
                      if (currentCount > maxLengthCompetitions) {
                        e.target.value = e.target.value.slice(0, maxLengthCompetitions);
                        currentCount = maxLengthCompetitions;
                      }
                      if (currentCount < 0) {
                        currentCount = 0;
                      }
                      setCharacterCompetitions(currentCount);
                      setIsSaved(false);
                    },
                    maxLength: maxLengthCompetitions,
                  })}
                />
                <p className='mt-8 title-1 pb-10 text-16'>
                  Characters Limit Remains: {characterLimitCompetitions}
                </p>
                <Textarea
                  label='Additional Information'
                  className='min-h-150'
                  placeholder='We have calendly integration service handled by ai'
                  register={register("aiSdrAdditionalInfoField", {
                    onChange: (e: any) => {
                      let currentCount = e.target.value.length;
                      if (currentCount > maxLength2) {
                        e.target.value = e.target.value.slice(0, maxLength2);
                        currentCount = maxLength2;
                      }
                      if (currentCount < 0) {
                        currentCount = 0;
                      }
                      setCharacterCount2(currentCount);
                      setIsSaved(false);
                    },
                    maxLength: maxLength2,
                  })}
                />
                <p className='mt-8 title-1 pb-10 text-16'>
                  Characters Limit Remains: {characterLimit2}
                </p>
                <div>
                  <div className='flex flex-col justify-start gap-6 p-8 py-12 border shadow-md bg-contentColor dark:bg-contentColor-dark border-borderColor dark:border-borderColor-dark rounded-md'>
                    <Switch
                      control={control}
                      name='aiSdrAutomated'
                      suffixLabel='Advance: AI Automated (Optional)'
                      // register={register("aiSdrAutomated", {
                      //   onChange: (e: any) => {
                      //     setValue("aiSdrAutomated", e.target.checked);
                      //     setIsSaved(false);
                      //   },
                      // })}
                    />
                    <p className='text-14 title-1'>
                      When this Option is ON the system will automatically Reply on your behalf.
                      when OFF you can review them prior to the Manual Reply
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className='flex gap-25 pt-10 '>
              <Button
                className=' w-125 px-4'
                buttonStyle='secondary'
                onClick={() => dispatch(setResetBuilderAiSdr())}
              >
                Back
              </Button>
              <Button
                prefix='MessageBox'
                disabled={!textAreaValue1?.length}
                buttonClassName=' px-4'
                onClick={() => {
                  if (builderAiSdr) {
                    dispatch(
                      setValueBuilderAiSdr({
                        id: builderAiSdr.id,
                        aiSdrPitchCTAId: aiSdrPitchCTAId,
                        aiSdrField: textAreaValue1,
                        aiSdrAdditionalInfoField: textAreaValue2,
                        aiSdrObjectionsField: textAreaValueObjections,
                        aiSdrCompetitionsField: textAreaValueCompetitions,
                        aiSdrAutomated: aiSdrAutomated,
                      })
                    );
                  }
                  setIsSaved(true);
                  setTimeout(() => {
                    dispatch(setResetBuilderAiSdr());
                  }, 0);
                }}
              >
                Save Message
              </Button>
            </div>
          </div>
        </div>
        <div className='flex items-center gap-10 p-16 rounded-lg bg-blue-100 dark:bg-hoverColor-dark mt-20'>
          <AiFillExclamationCircle className='flex-none w-24 h-24 dark:text-neutral-200 text-neutral-800' />
          <p className='text-neutral-800 dark:text-neutral-300 text-14'>
            {`This template will be used in your automation, if you adding a variable for AI it will
            create the message after we crawl the data from the user latest Social Post, About me
            etc. You will see an example in such a case on the right hand side composed how it will
            look like in general.`}
          </p>
        </div>
      </div>
      <div className='flex justify-center gap-25 pt-30'></div>
    </div>
  );
};

export default AiSdr;
