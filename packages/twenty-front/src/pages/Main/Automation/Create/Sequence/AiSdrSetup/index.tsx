import React, { useEffect, useState } from "react";
import { AiFillExclamationCircle } from "react-icons/ai";
import { useForm, useWatch } from "react-hook-form";

import Button from "src/components/base/Button";
import Icon from "src/components/base/Icon";
import Textarea from "src/components/base/Textarea";
import { IBuilderAiSdrSetup } from "src/utils/types/automation";
import { authSelector } from "src/store/Auth";
import { useAppDispatch, useAppSelector } from "src/hook/redux/useStore";
import { setResetBuilderAiSdrSetup, setValueBuilderAiSdrSetup } from "src/store/Automation";

type Props = {
  builderAiSdr?: IBuilderAiSdrSetup;
};

const AiSdrSetup: React.FC<Props> = ({ builderAiSdr }) => {
  const { control, register, setValue } = useForm();
  const dispatch = useAppDispatch();
  const textAreaValue1 = useWatch({ control, name: "aiSdrSetupSystemPrompt" });
  const textAreaValue2 = useWatch({ control, name: "aiSdrSetupPrompt" });

  const [isSaved, setIsSaved] = useState(false);

  const { userInfo } = useAppSelector(authSelector);
  const [characterCount1, setCharacterCount] = useState(textAreaValue1?.length || 0);
  const [characterCount2, setCharacterCount2] = useState(textAreaValue2?.length || 0);

  const [isButtonLoading, setIsButtonLoading] = useState(false);

  useEffect(() => {
    setValue("aiSdrSetupSystemPrompt", builderAiSdr?.aiSdrSetupSystemPrompt);
    setValue("aiSdrSetupPrompt", builderAiSdr?.aiSdrSetupPrompt);
  }, [builderAiSdr]);
  useEffect(() => {
    if (textAreaValue1?.length) {
      setCharacterCount(textAreaValue1.length);
    }
    if (textAreaValue2?.length) {
      setCharacterCount2(textAreaValue2.length);
    }
  }, [textAreaValue1, textAreaValue2]);
  const maxLength1 = 300;
  const maxLengthObjections = 300;
  const characterLimit1 = maxLength1 - (characterCount1 || 0);
  const labelOfMessage = "AISDR Setup";

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
                <Textarea
                  label='System Prompt'
                  className='min-h-150'
                  placeholder='We are offering best services of sales using ai'
                  register={register("aiSdrSetupSystemPrompt", {
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
                  label='Prompt'
                  className='min-h-150'
                  placeholder='We are offering best services of sales using ai'
                  register={register("aiSdrSetupPrompt", {
                    onChange: (e: any) => {
                      let currentCount = e.target.value.length;
                      if (currentCount > maxLengthObjections) {
                        e.target.value = e.target.value.slice(0, maxLengthObjections);
                        currentCount = maxLengthObjections;
                      }
                      if (currentCount < 0) {
                        currentCount = 0;
                      }
                      setIsSaved(false);
                    },
                    maxLength: maxLengthObjections,
                  })}
                />
              </div>
            </div>
            <div className='flex gap-25 pt-10 '>
              <Button
                className=' w-125 px-4'
                buttonStyle='secondary'
                onClick={() => dispatch(setResetBuilderAiSdrSetup())}
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
                      setValueBuilderAiSdrSetup({
                        id: builderAiSdr.id,
                        aiSdrSetupSystemPrompt: textAreaValue1,
                        aiSdrSetupPrompt: textAreaValue2,
                      })
                    );
                  }
                  setIsSaved(true);
                  setTimeout(() => {
                    dispatch(setResetBuilderAiSdrSetup());
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

export default AiSdrSetup;
