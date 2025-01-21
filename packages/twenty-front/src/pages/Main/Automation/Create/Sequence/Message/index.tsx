import React, { useEffect, useState } from "react";
import Avatar from "react-avatar";
import { AiFillExclamationCircle } from "react-icons/ai";
import { useForm, useWatch } from "react-hook-form";

import Button from "src/components/base/Button";
import Icon from "src/components/base/Icon";
import ReactSelectRh from "src/components/base/ReactSelectRh";
import Textarea from "src/components/base/Textarea";
import { IBuilderMessage } from "src/utils/types/automation";
import { ISelectOption } from "src/utils/types";
import { authSelector } from "src/store/Auth";
import { connectionRequestVariables } from "../../../Builder/TemplateFormOptions";
import { setResetBuilderMessage, setValueBuilderMessage } from "src/store/Automation";
import { useAppDispatch, useAppSelector } from "src/hook/redux/useStore";
import Input from "src/components/base/Input";
import axios from "src/utils/functions/axios";
import ConnectionRequestModal from "src/components/base/ConnectionRequestModal";
import DOMPurify from "dompurify";

type Props = {
  builderMessage?: IBuilderMessage;
};

const Message: React.FC<Props> = ({ builderMessage }) => {
  const { control, register, setValue } = useForm();
  const dispatch = useAppDispatch();
  // const textAreaValue = useWatch({ control, name: "messageField" });
  let imageUrl = useWatch({ control, name: "imageUrl" });
  let textAreaValue = useWatch({ control, name: "messageField" });
  const [isSaved, setIsSaved] = useState(false);

  const { userInfo } = useAppSelector(authSelector);
  const [characterCount, setCharacterCount] = useState(textAreaValue?.length || 0);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [connectionRequestPrompts, setConnectionRequestPrompts] = useState<any>();
  const [selectedLang, setSelectedLang] = useState(null);
  const [showConnectionRequestPrompts, setShowConnectionRequestPrompts] = useState(false);
  const [connectionRequestPromptsFetching, setConnectionRequestPromptsFetching] = useState<any>();
  const [selectedAiPrompt, setSelectedAiPrompt] = useState(null);
  const [textAreaValueDisplay, setTextAreaValueDisplay] = useState(textAreaValue);

  useEffect(() => {
    setValue("messageField", builderMessage?.message);
    setValue("imageUrl", builderMessage?.imgurl);
    // console.log("builderMessage use effect: ");
  }, [builderMessage]);
  useEffect(() => {
    if (textAreaValue?.length) {
      setCharacterCount(textAreaValue.length);
      // let replacedValue = connectionRequestPrompts?.reduce(
      //   (acc, item) => acc.replace(`#Prompt_${item.name}`, item.example),
      //   textAreaValue
      // );
      let replacedValue = connectionRequestPrompts?.reduce((acc, item) => {
        const regex = /#Language_[^_]+_/g;
        return acc.replace(regex, "");
      }, textAreaValue);
      replacedValue = connectionRequestPrompts?.reduce(
        (acc, item) => acc.replace(`#Prompt_${item.name}`, item.example),
        replacedValue
      );
      setTextAreaValueDisplay(replacedValue);
    }
  }, [textAreaValue]);
  const maxLength = builderMessage?.label === "Linkedin Connection Request" ? 300 : 4000;
  const characterLimit = maxLength - (characterCount || 0);
  const labelOfMessage =
    builderMessage?.label === "Linkedin Connection Request"
      ? "Adding Connection Request"
      : "Adding LinkedIn Message";

  // console.log("builderMessage " + textAreaValue);

  const handleAiTemplate = async () => {
    setSelectedLang(null);
    setShowConnectionRequestPrompts(true);
  };

  const onSelectTemplate = async (connectionRequestPrompt: any) => {
    setSelectedAiPrompt(connectionRequestPrompt);
  };

  const fetchConnectionRequestPrompts = async () => {
    setIsButtonLoading(true);
    try {
      const response = await axios(true).get(
        `${process.env.REACT_APP_WORKFLOW_API_URL}/workflow/0/mpgpt-connection-prompts`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response) {
        console.log("connection request prompts Response: ", response);
        setConnectionRequestPrompts(response);
        setIsButtonLoading(false);
      }
    } catch (error) {
      console.error("connection request prompts:", error);
      setIsButtonLoading(false);
    }
  };

  const fetchMessageSenderPrompts = async () => {
    setIsButtonLoading(true);
    try {
      const response = await axios(true).get(
        `${process.env.REACT_APP_WORKFLOW_API_URL}/workflow/0/mpgpt-message-prompts`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response) {
        console.log("message request prompts Response: ", response);
        setConnectionRequestPrompts(response);
        setIsButtonLoading(false);
      }
    } catch (error) {
      console.error("message request prompts:", error);
      setIsButtonLoading(false);
    }
  };

  const onConnectionRequestPromptSave = async () => {
    if (selectedAiPrompt) {
      const aiPrompt = (selectedAiPrompt as unknown as { name?: string })?.name;
      textAreaValue = textAreaValue || "";
      let textAreaValueDisplayNew = textAreaValue;
      textAreaValue +=
        " " +
        (selectedLang !== null && selectedLang !== undefined
          ? `#Language_${selectedLang}_`
          : "#Language_English_") +
        (aiPrompt ? `#Prompt_${aiPrompt}` : "");
      textAreaValueDisplayNew +=
        " " + (aiPrompt ? (selectedAiPrompt as unknown as { example?: string })?.example : "");
      // console.log("tval" + textAreaValue);
      setTextAreaValueDisplay(textAreaValueDisplayNew);
      // console.log("tval" + textAreaValue);
      setValue("messageField", textAreaValue);
      setShowConnectionRequestPrompts(false);
    }
  };
  const onLangChange = async (val: any) => {
    // console.log("val p: " + JSON.stringify(val.value));
    setSelectedLang(val.value);
  };

  useEffect(() => {
    if (!connectionRequestPromptsFetching) {
      if (builderMessage?.label === "Linkedin Connection Request") {
        fetchConnectionRequestPrompts();
      } else {
        fetchMessageSenderPrompts();
      }
      // fetchConnectionRequestPrompts();
      setConnectionRequestPromptsFetching(true);
    }
  }, []);

  return (
    <div className='absolute w-1140, inset-0 bg-bodyBgColor dark:bg-bodyBgColor-dark'>
      <ConnectionRequestModal
        templates={connectionRequestPrompts}
        selectedTemplate={selectedAiPrompt}
        onSelectTemplate={onSelectTemplate}
        show={showConnectionRequestPrompts}
        onClose={() => setShowConnectionRequestPrompts(false)}
        onMgptPromptSave={onConnectionRequestPromptSave}
        onLangChange={onLangChange}
      ></ConnectionRequestModal>
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
            <div className='flex items-center gap-20'>
              <p className='mt-8 title-1 pb-10 text-16'>
                Add a template for you LinkedIn Message or use AI
              </p>
            </div>
            <div className='grid grid-cols-2 gap-40'>
              <div className='flex flex-col gap-12'>
                <Button
                  prefix='GiFairyWand'
                  buttonClassName=' px-2 py-12 mt-8'
                  disabled={isButtonLoading || !connectionRequestPrompts}
                  isPending={isButtonLoading}
                  onClick={() => {
                    handleAiTemplate();
                  }}
                >
                  Choose AI Template
                </Button>
                <ReactSelectRh
                  label='Predefined Variable'
                  control={control}
                  name='connection_request_variable'
                  options={connectionRequestVariables}
                  handleChange={(option: ISelectOption) => {
                    const val = option.value;
                    let newVal = "";
                    if (textAreaValue) {
                      newVal = textAreaValue.includes(val)
                        ? textAreaValue
                        : textAreaValue + " " + option?.value + " ";
                    } else {
                      newVal = val;
                    }
                    setValue("messageField", newVal);
                    setIsSaved(false);
                  }}
                />
                <Textarea
                  label='Text of Message'
                  className='min-h-150'
                  placeholder='#Language_English_#Prompt_MPGPTCRPrompt1'
                  register={register("messageField", {
                    onChange: (e: any) => {
                      let currentCount = e.target.value.length;
                      if (currentCount > maxLength) {
                        e.target.value = e.target.value.slice(0, maxLength);
                        currentCount = maxLength;
                      }
                      if (currentCount < 0) {
                        currentCount = 0;
                      }
                      setCharacterCount(currentCount);
                      setIsSaved(false);
                    },
                    maxLength: maxLength,
                  })}
                />
                <Input
                  type={"text"}
                  label={"Embed Image Url (optional)"}
                  placeholder={"Image Url"}
                  id={"imageUrl"}
                  register={register("imageUrl", {
                    onChange: (e: any) => {
                      imageUrl = e.target.value;
                    },
                  })}
                />
                <p className='mt-8 title-1 pb-10 text-16'>
                  Characters Limit Remains: {characterLimit}
                </p>
              </div>
              <div className='flex flex-col p-16 border rounded-lg mt-20 border-borderColor bg-bodyBgColor dark:bg-contentColor-dark dark:border-borderColor-dark h-fit pb-30'>
                <div className='flex items-center gap-10'>
                  <Avatar src={userInfo?.avatar} name={userInfo?.full_name} size='40' round />
                  <p className='text-14 title-1'>{userInfo?.full_name}</p>
                </div>
                <p className='pt-10 pl-50 text-neutral-700 dark:text-neutral-400 text-14'>
                  {textAreaValueDisplay ?? ""}
                </p>
                {/* <div
                  className='pt-10 pl-50 text-neutral-700 dark:text-neutral-400 text-14'
                  // dangerouslySetInnerHTML={{ __html: textAreaValue }}
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(textAreaValueDisplay ?? "", {
                        ADD_TAGS: ["img"], // Allow the <img> tag
                        FORBID_ATTR: ["style"], // Remove inline styles for security
                      }),
                    }}
                  />
                </div> */}
              </div>
            </div>
            <div className='flex gap-25 pt-10 '>
              <Button
                className=' w-125 px-4'
                buttonStyle='secondary'
                onClick={() => dispatch(setResetBuilderMessage())}
              >
                Back
              </Button>
              <Button
                prefix='MessageBox'
                disabled={!textAreaValue?.length}
                buttonClassName=' px-4'
                onClick={() => {
                  if (builderMessage) {
                    dispatch(
                      setValueBuilderMessage({
                        id: builderMessage.id,
                        message: textAreaValue,
                        label: builderMessage.label,
                        imgurl: imageUrl,
                      })
                    );
                  }
                  setIsSaved(true);
                  setTimeout(() => {
                    dispatch(setResetBuilderMessage());
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
      <div className='flex justify-center gap-25 pt-30'>
        {/* <Button
          disabled={!isSaved}
          className='w-125'
          onClick={() => dispatch(setResetBuilderMessage())}
        >
          Next
        </Button> */}
      </div>
    </div>
  );
};

export default Message;
