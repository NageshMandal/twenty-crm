import React, { useEffect, useRef, useState } from "react";
import Avatar from "react-avatar";
import { AiFillExclamationCircle } from "react-icons/ai";
// import { GiFairyWand } from "react-icons/gi";
import { useFieldArray, useForm, useWatch } from "react-hook-form";

import Button from "src/components/base/Button";
import Icon from "src/components/base/Icon";
import Textarea from "src/components/base/Textarea";
import { IBuilderEmail } from "src/utils/types/automation";
import { ISelectOption } from "src/utils/types";
import { authSelector } from "src/store/Auth";
import {
  connectionRequestVariables,
  emailTemplateVariables,
} from "../../../Builder/TemplateFormOptions";
import {
  setValueBuilderEmail,
  setResetBuilderEmail,
  automationSelector,
  setBuilderScreenMode,
} from "src/store/Automation";
import { useAppDispatch, useAppSelector } from "src/hook/redux/useStore";
import Input from "src/components/base/Input";
import axios from "src/utils/functions/axios";
import ReactSelectCard from "src/components/base/ReactSelectCard";
import { RiFullscreenFill, RiFullscreenExitLine } from "react-icons/ri";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import DOMPurify from "dompurify";
import ReactSelectRh from "src/components/base/ReactSelectRh";
import { toast } from "react-toastify";
import SplashScreen from "src/components/modules/SplashScreen";
import MgptModal from "src/components/base/MgptModal";
import ReactSelect from "src/components/base/ReactSelect";
import Switch from "src/components/base/Switch";

type Props = {
  builderEmail?: IBuilderEmail;
};

const Email: React.FC<Props> = ({ builderEmail }) => {
  const { isFullScreen } = useAppSelector(automationSelector);
  const { control, register, setValue } = useForm();
  const { fields } = useFieldArray({
    control,
    name: "mailboxrotation",
  });

  useEffect(() => {
    // Set default values after the form is initialized
    setValue("mailboxrotation", true);
  }, [setValue]);
  const dispatch = useAppDispatch();
  let textAreaValue = useWatch({ control, name: "emailField" });
  const isRotating = useWatch({ control, name: "mailboxrotation" });
  const [isSaved, setIsSaved] = useState(false);

  const { userInfo } = useAppSelector(authSelector);
  const [characterCount, setCharacterCount] = useState(textAreaValue?.length || 0);
  const [existingEmailTemplates, setExistingEmailTemplates] = useState<any>();
  const [mailboxes, setMailboxes] = useState<any>();
  const [mailboxesFetching, setMailboxesFetching] = useState<any>();
  const [mailboxesId, setMailboxesId] = useState<any>();
  const [dataFetching, setDataFetching] = useState(false);
  const [mgptFetching, setMgptFetching] = useState<any>();
  const [mgptPrompts, setMgptPrompts] = useState<any>();
  const [selectedAiPrompt, setSelectedAiPrompt] = useState(null);
  const [showMgptPrompts, setShowMgptPrompts] = useState(false);
  const [mailId, setMailId] = useState<any>();
  const [mailName, setMailName] = useState("");
  const [mailSubject, setMailSubject] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [selectedLang, setSelectedLang] = useState("English");
  const [textAreaValueDisplay, setTextAreaValueDisplay] = useState(textAreaValue);
  // const [isRotating, setIsRotating] = useState(true);

  useEffect(() => {
    // setValue("emailField", builderEmail?. || "");
    setMailId(builderEmail?.templateId);
    setMailboxesId(builderEmail?.mailboxId);
    if (builderEmail?.isRotating) {
      setValue("mailboxrotation", builderEmail?.isRotating);
    } else {
      setValue("mailboxrotation", true);
    }
    console.log("builderEmail use effect: " + JSON.stringify(builderEmail));
  }, [builderEmail]);
  useEffect(() => {
    if (textAreaValue?.length) {
      setCharacterCount(textAreaValue.length);
      // let replacedValue = mgptPrompts?.reduce(
      //   (acc, item) => acc.replace(`#Language_${selectedLang ?? "English"}_`, ""),
      //   textAreaValue
      // );
      let replacedValue = mgptPrompts?.reduce((acc, item) => {
        const regex = /#Language_[^_]+_/g;
        return acc.replace(regex, "");
      }, textAreaValue);
      replacedValue = mgptPrompts?.reduce(
        (acc, item) => acc.replace(`#Prompt_${item.name}`, item.example),
        replacedValue
      );
      setTextAreaValueDisplay(replacedValue);
    }
  }, [textAreaValue]);
  const fetchEmailTemplates = async () => {
    // if (!dataFetching) {
    // setIsPageLoading(true);
    setIsButtonLoading(true);
    try {
      const response = await axios(true).get(
        `${process.env.REACT_APP_PLAYBOOK_API_URL}/templates`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response) {
        // console.log("Email Templates Response: ", response);
        setExistingEmailTemplates(response);
        setIsPageLoading(false);
        setIsButtonLoading(false);
        toast.success("Templates Loaded");
        //when templated is loaded and templateID is not null load the template
        const foundTemplate = (response as unknown as any).find(
          (template) => template.id === builderEmail?.templateId
        );

        if (foundTemplate) {
          setValue("emailField", foundTemplate.body);
          setMailName(foundTemplate.name);
          setMailSubject(foundTemplate.subject);
          setMailId(foundTemplate.id);
          // console.log("mailboxid", builderEmail?.templateId);
        }
        // if (builderEmail?.templateId) {
        //   setValue("emailField", response[builderEmail?.templateId].body);
        //   setMailName(response[builderEmail?.templateId].name);
        //   setMailSubject(response[builderEmail?.templateId].subject);
        //   setMailId(response[builderEmail?.templateId].id);
        //   console.log("mailboxid", builderEmail?.templateId);
        // }
      }
    } catch (error) {
      console.error("Email Template Loading:", error);
    }
    setIsPageLoading(false);
    setIsButtonLoading(false);
    // }
  };
  const fetchMailboxes = async () => {
    if (!mailboxesFetching) {
      // setIsPageLoading(true);
      setIsButtonLoading(true);
      try {
        const response = await axios(true).get(
          `${process.env.REACT_APP_PLAYBOOK_API_URL}/mailboxes`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response) {
          // console.log("Emailbb Response: ", response);
          const traverseAndModify = (data: any): any => {
            if (Array.isArray(data)) {
              return data.map((item) => traverseAndModify(item));
            } else if (typeof data === "object") {
              for (const key in data) {
                data[key] = traverseAndModify(data[key]);
                if (key === "email" && data[key]) {
                  data.label = data[key]; // Reassign email as lab
                  // data.value = data[key];
                }
                if (key === "id" && data[key]) {
                  data.value = data[key];
                }
              }
            }
            return data;
          };

          const modifiedResponse = traverseAndModify(response);
          const filteredResponse = modifiedResponse.filter((mailbox) => mailbox.send_status !== 0);
          // setMailboxes(modifiedResponse);

          // console.log("Emailab Response: ", modifiedResponse);
          if (!mailboxesId) {
            setMailboxesId(filteredResponse[0].value);
          }
          setMailboxes(filteredResponse);
        }
      } catch (error) {
        console.error("Email Template Loading:", error);
      }
      setIsPageLoading(false);
    }
  };
  const fetchMgpt = async () => {
    setIsButtonLoading(true);
    try {
      const response = await axios(true).get(
        `${process.env.REACT_APP_WORKFLOW_API_URL}/workflow/0/mgptai-prompts`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response) {
        console.log("mgpt Response: ", response);
        setMgptPrompts(response);
      }
    } catch (error) {
      console.error("mgptai prompts:", error);
    }
  };
  useEffect(() => {
    if (!dataFetching) {
      fetchEmailTemplates();
      setDataFetching(true);
    }
    if (!mailboxesFetching) {
      fetchMailboxes();
      setMailboxesFetching(true);
    }
    if (!mgptFetching) {
      fetchMgpt();
      setMgptFetching(true);
    }
  }, []);
  const handleUpdateEmailTemplate = async () => {
    let data = null;
    toast.info("Template Updating");
    // setIsPageLoading(true);
    setIsButtonLoading(true);
    if (!mailName) {
      setMailName(mailSubject);
    }
    if (mailId) {
      if (Array.isArray(existingEmailTemplates)) {
        data = existingEmailTemplates?.find((item: any) => item.id === mailId);
      }
    }
    if (data) {
      data.name = mailName;
      data.subject = mailSubject;
      data.body = textAreaValue;
      try {
        const response = await axios(true).put(
          `${process.env.REACT_APP_PLAYBOOK_API_URL}/templates/${mailId}`,
          data
        );
        if (response) {
          setDataFetching(false);
          fetchEmailTemplates();
          setDataFetching(true);
          setIsPageLoading(false);
          setIsButtonLoading(false);
          toast.success("Template Saved success");
        }
      } catch (error) {
        console.error("Email Template Loading:", error);
      }
    }
    console.log("data: " + JSON.stringify(data));
    console.log("data: " + mailId);
    // try {
    //   const response = await axios(true).post(
    //     `${process.env.REACT_APP_PLAYBOOK_API_URL}/templates/`,
    //     data
    //   );
    //   if (response) {
    //     setDataFetching(false);
    //     fetchEmailTemplates();
    //     setDataFetching(true);
    //     toast.success("Template Saved success");
    //   }
    // } catch (error) {
    //   console.error("Email Template Loading:", error);
    // }
    setIsPageLoading(false);
    setIsButtonLoading(false);
  };
  const handleSaveTemplateAsNew = async () => {
    toast.info("Template Saving as New");
    // setIsPageLoading(true);
    setIsButtonLoading(true);
    let data = null;
    if (!mailName) {
      setMailName(mailSubject);
    }
    if (mailId) {
      if (Array.isArray(existingEmailTemplates)) {
        data = existingEmailTemplates?.find((item: any) => item.id === mailId);
      }
    }
    if (data) {
      data.id = null;
      data.name = mailName;
      data.subject = mailSubject;
      data.body = textAreaValue;
    } else {
      data = {
        privacy_level: 2,
        folder_id: null,
        name: mailName,
        subject: mailSubject,
        body: textAreaValue,
      };
    }
    try {
      const response = await axios(true).post(
        `${process.env.REACT_APP_PLAYBOOK_API_URL}/templates`,
        data
      );
      if (response) {
        setDataFetching(false);
        fetchEmailTemplates();
        setDataFetching(true);
        // const id = (response as unknown as { id: number }).id;
        let id = null;
        if (response && typeof response === "object" && "id" in response) {
          id = response.id;
          setMailId(response.id);
        }
        // if (id) {
        //   setMailId(id);
        // }
        // console.log("response: " + JSON.stringify(id));
        // console.log("response: " + JSON.stringify(response));
        setIsPageLoading(false);
        setIsButtonLoading(false);
        toast.success("Template Saved success");
      }
    } catch (error) {
      console.error("Email Template Loading:", error);
      toast.error("Template Saved Error: " + JSON.stringify(error.response?.data));
    }
    setIsPageLoading(false);
    setIsButtonLoading(false);
  };
  const handleDeleteTemplate = async () => {
    toast.info("Template Deleting");
    // setIsPageLoading(true);
    setIsButtonLoading(true);
    try {
      const response = await axios(true).delete(
        `${process.env.REACT_APP_PLAYBOOK_API_URL}/templates/${mailId}`
      );
      if (response) {
        setDataFetching(false);
        fetchEmailTemplates();
        setDataFetching(true);
        setMailId(undefined);
        setMailboxesId(undefined);
        setMailName("");
        setMailSubject("");
        textAreaValue = "";
        setValue("emailField", "");
        setIsPageLoading(false);
        dispatch(
          setValueBuilderEmail({
            id: builderEmail?.id,
            templateId: undefined,
            mailboxId: undefined,
            isRotating: undefined,
          })
        );
        toast.success("Template Deleted success");
      }
    } catch (error) {
      console.error("Email Template Loading:", error);
    }
    console.log("data: " + mailId);
    setIsPageLoading(false);
  };
  const handleAiTemplate = async () => {
    setSelectedLang(null);
    setShowMgptPrompts(true);
  };
  const onSelectTemplate = async (mgptprompt: any) => {
    setSelectedAiPrompt(mgptprompt);
  };
  const onMgptPromptSave = async () => {
    // console.log(selectedLang);
    // console.log(selectedLang !== null);
    // console.log(selectedLang !== undefined);
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
      setValue("emailField", textAreaValue);
      setShowMgptPrompts(false);
    }
  };
  const onLangChange = async (val: any) => {
    // console.log("val p: " + JSON.stringify(val.value));
    setSelectedLang(val.value);
  };
  const maxLength = 4000;
  const characterLimit = maxLength - (characterCount || 0);
  const labelOfMessage = "Send Mail";

  return (
    <div
      className={
        isFullScreen
          ? " w-1140, inset-0 bg-bodyBgColor dark:bg-bodyBgColor-dark fixed nowheel h-screen left-120 pb-60"
          : ""
      }
      style={{
        overflowY: isFullScreen ? "auto" : "hidden",
      }}
    >
      {isPageLoading ? (
        <div className='fixed inset-0 z-50'>
          <SplashScreen />
        </div>
      ) : (
        <div
          className={`scrollbar-1 flex flex-col w-1140 ${
            isFullScreen ? "scrollbar-1  h-[calc(100vh)]" : "scrollbar-1  h-[calc(100vh)]"
          }`}
        >
          <MgptModal
            templates={mgptPrompts}
            selectedTemplate={selectedAiPrompt}
            onSelectTemplate={onSelectTemplate}
            show={showMgptPrompts}
            onClose={() => setShowMgptPrompts(false)}
            onMgptPromptSave={onMgptPromptSave}
            onLangChange={onLangChange}
          ></MgptModal>
          <div className='absolute w-1140, inset-0 bg-bodyBgColor dark:bg-bodyBgColor-dark scrollbar-1'>
            <div className='flex items-center justify-between max-w-1100'>
              <div className='flex items-center gap-12 py-30'>
                <div className='p-12 overflow-hidden bg-primary-2 rounded-xl'>
                  <Icon name='MessageBox' className='w-20 h-20 text-white' />
                </div>
                <p className='font-normal text-neutral-800 dark:text-neutral-300 text-24'>
                  {labelOfMessage}
                </p>
              </div>
              <div
                className='flex items-center justify-end gap-10 pr-10 transition-colors duration-200 cursor-pointer hover:text-neutral-800 hover:dark:text-neutral-300 text-neutral-700 dark:text-neutral-400'
                role='button'
                onClick={() =>
                  isFullScreen
                    ? dispatch(setBuilderScreenMode(false))
                    : dispatch(setBuilderScreenMode(true))
                }
              >
                <p className=''>{isFullScreen ? "Small Screen" : "Full Screen"}</p>
                {isFullScreen ? (
                  <RiFullscreenExitLine className='w-24 h-24' />
                ) : (
                  <RiFullscreenFill className='w-24 h-24 ' />
                )}
              </div>
            </div>
            <div className='px-32 border rounded-lg py-26 border-borderColor dark:border-borderColor-dark'>
              <div className='gap-60'>
                <div className='flex flex-col'>
                  <div className='flex items-center gap-20'>
                    <p className='pb-10 mt-8 title-1 text-16'>
                      Add a template for Email or use an existing one
                    </p>
                  </div>
                  <div className='grid grid-cols-2 gap-40'>
                    <div className='flex flex-col gap-12 pb-4'>
                      <div className='border rounded-lg py-26 border-borderColor dark:border-borderColor-dark p-12 mb-8'>
                        <ReactSelectCard
                          label='Choose Existing Templates'
                          control={control}
                          name='existing_email_tempates'
                          options={existingEmailTemplates}
                          handleChange={(option: any) => {
                            setValue("emailField", option.body);
                            setMailName(option.name);
                            setMailSubject(option.subject);
                            setMailId(option.id);
                            setIsSaved(false);
                          }}
                        />
                      </div>
                      <div className='border rounded-lg py-26 border-borderColor dark:border-borderColor-dark p-12 mb-8'>
                        <Input
                          className='pb-4'
                          type={"text"}
                          label={"Name"}
                          placeholder={"Name"}
                          id={"mailName"}
                          value={mailName}
                          register={register("mailName", {
                            onChange: (e: any) => {
                              setMailName(e.target.value);
                            },
                          })}
                        />
                        <Input
                          className='pb-4'
                          type={"text"}
                          label={"Subject"}
                          placeholder={"Subject"}
                          id={"mailSubject"}
                          value={mailSubject}
                          register={register("imageUrl", {
                            onChange: (e: any) => {
                              setMailSubject(e.target.value);
                            },
                          })}
                        />
                        <Button
                          prefix='GiFairyWand'
                          buttonClassName=' px-2 py-12 mt-8'
                          disabled={isButtonLoading || !mgptPrompts}
                          isPending={isButtonLoading}
                          onClick={() => {
                            // handleUpdateEmailTemplate();
                            handleAiTemplate();
                          }}
                        >
                          Choose AI Template
                        </Button>
                        <ReactSelectRh
                          label='Predefined Variables'
                          control={control}
                          name='email_template_variables'
                          options={emailTemplateVariables}
                          handleChange={(option: ISelectOption) => {
                            const val = option.value;
                            let newVal = "";
                            if (textAreaValue) {
                              const updatedOptionValue = val.replace(/#(\w+)/g, "{{$1}}");
                              newVal = textAreaValue.includes(val)
                                ? textAreaValue + updatedOptionValue + " "
                                : textAreaValue + " " + updatedOptionValue + " ";
                            } else {
                              newVal = textAreaValue + val.replace(/#(\w+)/g, "{{$1}}");
                            }
                            setValue("emailField", newVal);
                            setIsSaved(false);
                          }}
                        />
                        <ReactQuill
                          onFocus={() => setIsFocus(true)}
                          onBlur={() => setIsFocus(false)}
                          theme='snow'
                          value={textAreaValue}
                          onChange={(val) => {
                            // if (isFocus) {
                            setValue("emailField", val);
                            textAreaValue = val;
                            let currentCount = val.length;
                            if (currentCount > maxLength) {
                              val = val.slice(0, maxLength);
                              currentCount = maxLength;
                              setValue("emailField", val);
                              textAreaValue = val;
                              return null;
                            }
                            if (currentCount < 0) {
                              currentCount = 0;
                            }
                            setCharacterCount(currentCount);
                            setIsSaved(false);
                            // }
                          }}
                          className={`react-quill min-h-150 pb-40 ${isFocus ? "quill-focus" : ""}`}
                        />
                        <br />
                        <p className='pb-10 mt-8 title-1 text-16'>
                          Characters Limit Remains: {characterLimit}
                        </p>
                      </div>
                      <div className='border rounded-lg py-26 border-borderColor dark:border-borderColor-dark p-12 mb-8'>
                        <div className='pb-8 mb-8'>
                          <Switch
                            control={control}
                            name='mailboxrotation'
                            suffixLabel='MailBox Rotation'
                          />
                          <p className='text-12 title-1'>
                            Keep Mailbox Rotation Switch ON For Better Email Deliverability
                          </p>
                        </div>
                        <ReactSelect
                          label='Choose Default MailBox'
                          // control={control}
                          // name='email_mailbox'
                          options={mailboxes}
                          value={
                            Array.isArray(mailboxes)
                              ? mailboxes.find((mailbox: any) => mailbox.value === mailboxesId)
                              : null
                          }
                          // value={
                          //   Array.isArray(mailboxes)
                          //     ? mailboxesId
                          //       ? mailboxes.find((mailbox: any) => mailbox.value === mailboxesId)
                          //       : mailboxes.find(
                          //           (mailbox: any) => mailbox.value === mailbox.value[0]
                          //         )
                          //     : null
                          // }
                          onChange={(option: ISelectOption) => {
                            // const val = textAreaValue + " " + option.value;
                            // setValue("emailField", val);
                            // setMailboxesId(option.value);
                            // setIsSaved(false);
                            if (Array.isArray(mailboxes)) {
                              setMailboxesId(option.value);
                              setIsSaved(false);
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className='flex flex-col p-16 mt-20 border rounded-lg border-borderColor bg-bodyBgColor dark:bg-contentColor-dark dark:border-borderColor-dark h-fit pb-30'>
                      <div className='flex items-center gap-10'>
                        <Avatar src={userInfo?.avatar} name={userInfo?.full_name} size='40' round />
                        <p className='text-14 title-1'>{userInfo?.full_name}</p>
                      </div>
                      <div
                        className='pt-10 pl-50 text-neutral-700 dark:text-neutral-400 text-14'
                        // dangerouslySetInnerHTML={{ __html: textAreaValue }}
                      >
                        <div
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(textAreaValueDisplay, {
                              ADD_TAGS: ["img"], // Allow the <img> tag
                              FORBID_ATTR: ["style"], // Remove inline styles for security
                            }),
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className='flex pt-10 gap-25 '>
                    <Button
                      prefix='MessageBox'
                      className='px-4 '
                      buttonStyle='error'
                      disabled={!mailId || isButtonLoading}
                      isPending={isButtonLoading}
                      onClick={() => {
                        handleDeleteTemplate();
                      }}
                    >
                      Delete Selected Template
                    </Button>
                    <Button
                      prefix='MessageBox'
                      buttonClassName=' px-4'
                      disabled={!mailId || !mailSubject || isButtonLoading}
                      isPending={isButtonLoading}
                      onClick={() => {
                        handleUpdateEmailTemplate();
                      }}
                    >
                      Update Selected Template
                    </Button>
                    <Button
                      prefix='MessageBox'
                      buttonClassName=' px-4'
                      disabled={!mailSubject || isButtonLoading}
                      isPending={isButtonLoading}
                      onClick={() => {
                        handleSaveTemplateAsNew();
                      }}
                    >
                      Save This as New Template
                    </Button>
                    {/* <Button className='w-125' onClick={() => dispatch(setResetBuilderEmail())}>
                    Finish
                  </Button> */}
                  </div>
                </div>
              </div>
              <div className='flex items-center gap-10 p-16 mt-20 bg-blue-100 rounded-lg dark:bg-hoverColor-dark'>
                <AiFillExclamationCircle className='flex-none w-24 h-24 dark:text-neutral-200 text-neutral-800' />
                <p className='text-neutral-800 dark:text-neutral-300 text-14'>
                  {`This template will be used in your automation, if you adding a variable for AI it will
            create the message after we crawl the data from the user latest Social Post, About me
            etc. You will see an example in such a case on the right hand side composed how it will
            look like in general.`}
                </p>
              </div>
            </div>
            <div className='flex justify-center pt-10 pb-10 gap-25'>
              <div className='flex pt-10 gap-25 '>
                <Button
                  className='px-4  w-125'
                  buttonStyle='secondary'
                  // disabled={isButtonLoading}
                  // isPending={isButtonLoading}
                  onClick={() => dispatch(setResetBuilderEmail())}
                >
                  Back
                </Button>
                <Button
                  className='w-125'
                  disabled={isButtonLoading || !mailId || !mailboxesId}
                  isPending={isButtonLoading}
                  onClick={() => {
                    if (builderEmail) {
                      dispatch(
                        setValueBuilderEmail({
                          id: builderEmail.id,
                          templateId: mailId,
                          mailboxId: mailboxesId,
                          isRotating: isRotating,
                        })
                      );
                    }
                    setIsSaved(true);
                    setTimeout(() => {
                      dispatch(setResetBuilderEmail());
                    }, 0);
                  }}
                >
                  Finish
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Email;
