import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { Handle, Position, useReactFlow } from "reactflow";
import { GoTrash, GoStopwatch } from "react-icons/go";
import { BiMessageDetail } from "react-icons/bi";
import { RiDragMove2Fill } from "react-icons/ri";
import { Popover, Transition } from "@headlessui/react";
import { FieldValues, useForm } from "react-hook-form";

import Icon, { IconType } from "src/components/base/Icon";
import {
  commentsUsageArray,
  delayUnit,
  likedPostsUsageArray,
  workflowAutomationsArray,
} from "./TemplateFormOptions";
import Button from "src/components/base/Button";
import Input from "src/components/base/Input";
import ReactSelectRh from "src/components/base/ReactSelectRh";
import useOutsideClick from "src/hook/common/useOutsideClick";
import { ISelectOption } from "src/utils/types";
import { useAppDispatch, useAppSelector } from "src/hook/redux/useStore";
import {
  automationSelector,
  setBuilderScreenMode,
  setValueBuilderAiSdr,
  setValueBuilderEmail,
  setValueBuilderMessage,
  setValueBuilderAiSdrSetup,
} from "src/store/Automation";
import MenuButtonBuilder from "src/components/base/MenuButtonBuilder";

interface NodeData {
  delayValue: any;
  delayUnit: any;
  profileNumber: any;
  messageField: any;
  searchURL: any;
  formData: FormData;
  onDeleteClick: any;
  label: string;
  isInitialNode: boolean;
  isDropDownDisabled: boolean;
  isDelay?: boolean;
  proNodeId?: string;
  menuData: any;
  isFormField?: boolean;
  isRootUrlCorrect?: boolean;
  isNewNode?: boolean;
  isOnStep?: any;
  imageUrl?: any;
  templateId?: any;
  mailboxId?: any;
  isRotating?: any;
  // stats?: any;
  // showStats?: any;
  aiSdrPitchCTAId?: any;
  aiSdrField?: any;
  aiSdrAdditionalInfoField?: any;
  aiSdrObjectionsField?: any;
  aiSdrCompetitionsField?: any;
  aiSdrAutomated?: any;
  parentId?: any;
  aiSdrSetupSystemPrompt?: any;
  aiSdrSetupPrompt?: any;
  defineIcpAndPersona?: any;
  typesAndSignals?: any;
}

interface FormData {
  [key: string]: string | { value: string; label: string };
}

const AddActionNode = ({ data, id }: { data: NodeData; id: string }) => {
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLInputElement | null>(null);
  // const applyButtonRef = useRef<HTMLButtonElement>(null);
  const { setNodes } = useReactFlow();
  const { builderMessage } = useAppSelector(automationSelector);
  const { builderEmail } = useAppSelector(automationSelector);
  const { builderAiSdr } = useAppSelector(automationSelector);
  const { builderAiSdrSetup } = useAppSelector(automationSelector);

  const { register, control, setValue, handleSubmit, watch } = useForm();
  const [isRootUrlCorrect, setIsRootUrlCorrect] = useState<boolean>(true);
  // const [isFillFormValues, setIsFillFormValues] = useState<boolean>(false);
  const fieldValues = watch();
  const [isNewNode, setIsNewNode] = useState(data.isNewNode === undefined ? true : data.isNewNode);

  // const isFillFormValues = useMemo(() => {
  //   const isFill = Object.entries(fieldValues)?.filter(([key, item]) => {
  //     let nonEmpty;
  //     if (typeof item === "string" && key) {
  //       nonEmpty = !!item.length;
  //     } else {
  //       nonEmpty = !!JSON.stringify(item)?.length;
  //     }
  //     return item === "undefined" || !nonEmpty ? true : false;
  //   })?.length;
  //   return !!isFill;
  // }, [fieldValues]);

  // useEffect(() => {
  //   const isFill = Object.entries(fieldValues)?.filter(([key, item]) => {
  //     let nonEmpty;
  //     if (typeof item === "string" && key) {
  //       nonEmpty = !!item.length;
  //     } else {
  //       nonEmpty = !!JSON.stringify(item)?.length;
  //     }
  //     return item === "undefined" || !nonEmpty ? true : false;
  //   })?.length;
  //   setIsFillFormValues(!!isFill);
  // }, [fieldValues]);

  const [selectedOption, setSelectedOption] = useState(data.label);

  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [shouldRerender, setShouldRerender] = useState(false);
  // const { messageFieldValue, setMessageFieldValue } = useState("");
  data.formData = watch();

  const handleOptionClick = (val: string) => {
    setSelectedOption(val);
    data.label = val;
  };

  const handleAutoSelect = useCallback(
    (isSelect: boolean) => {
      // console.log("====formdta: " + JSON.stringify(data?.delayValue));
      setNodes((nodes) => {
        return nodes.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              selected: isSelect ? true : false,
            };
          }
          if (node.id === data?.proNodeId) {
            return {
              ...node,
              selected: isSelect ? true : false,
            };
          }
          return node;
        });
      });
    },
    [setNodes]
  );

  useOutsideClick(ref, () => {
    setIsOpenEdit(false);
    handleAutoSelect(false);
  });

  // Find the selected workflow based on node.data.label
  const selectedWorkflow = workflowAutomationsArray.find(
    (workflow) => workflow.title.toLowerCase() === data.label.toLowerCase()
  );

  const handleApply = (formValues: FieldValues) => {
    // console.log("isrootbefore: " + isRootUrlCorrect);
    if (selectedWorkflow && selectedWorkflow.title == "Linkedin Sales Navigator Search Extractor") {
      if (
        formValues.searchURL &&
        !formValues.searchURL.startsWith("https://www.linkedin.com/sales/search/")
      ) {
        setIsRootUrlCorrect(false);
        return null;
      } else {
        setIsRootUrlCorrect(true);
      }
    } else if (selectedWorkflow && selectedWorkflow.title == "Linkedin Sales Navigator List") {
      if (
        formValues.searchURL &&
        !formValues.searchURL.startsWith("https://www.linkedin.com/sales/lists/")
      ) {
        setIsRootUrlCorrect(false);
        return null;
      } else {
        setIsRootUrlCorrect(true);
      }
    } else if (selectedWorkflow && selectedWorkflow.title == "Linkedin Search Extractor") {
      if (formValues.link && !formValues.link.startsWith("https://www.linkedin.com/search/")) {
        setIsRootUrlCorrect(false);
        return null;
      } else {
        setIsRootUrlCorrect(true);
      }
    } else if (selectedWorkflow && selectedWorkflow.title == "Linkedin Group Extractor") {
      if (
        formValues.groupUrl &&
        !formValues.groupUrl.startsWith("https://www.linkedin.com/groups/")
      ) {
        setIsRootUrlCorrect(false);
        return null;
      } else {
        setIsRootUrlCorrect(true);
      }
    } else {
      setIsRootUrlCorrect(true);
    }
    if (selectedWorkflow && selectedWorkflow.title == "Delay") {
      // data.delayUnit = formValues.delayUnit;
      data.delayUnit = {
        label: formValues.delayUnit.label,
        value: formValues.delayUnit.value,
      };
      data.delayValue = formValues.delayValue;
    }
    if (selectedWorkflow?.title === "Linkedin Sales Navigator List") {
      data.profileNumber = formValues.profileNumber;
      data.searchURL = formValues.searchURL;
    }
    if (selectedWorkflow?.title === "AISDR Linkedin Sales Navigator List") {
      data.profileNumber = formValues.profileNumber;
      data.searchURL = formValues.searchURL;
      data.defineIcpAndPersona = formValues.defineIcpAndPersona;
    }
    if (selectedWorkflow?.title === "AISDR Types and Signals") {
      data.typesAndSignals = formValues.typesAndSignals;
    }

    if (data.isDelay) {
      data.formData = {
        delayUnit: {
          label: formValues.delayUnit?.label,
          value: formValues.delayUnit?.value,
        },
        delayValue: formValues.delayValue,
      };
    } else {
      delete formValues.connection_request_variable;
      data.formData = formValues;
    }

    const fieldsToUpdate = [
      "searchURL",
      "profileNumber",
      "messageField",
      "delayValue",
      "withdrawal",
      "link",
      "numberOfMembers",
      "commentersUsage",
      "reactionType",
      "proficiency",
      "relationship",
      "extractProfileNumber",
      "websiteSearchURL",
      "location",
      "industry",
      "companySize",
      "technologyUsage",
      "companyName",
      "jobTitle",
      "groupUrl",
      "templateId",
      "mailboxId",
      "isRotating",
      "aiSdrPitchCTAId",
      "aiSdrField",
      "aiSdrAdditionalInfoField",
      "aiSdrObjectionsField",
      "aiSdrCompetitionsField",
      "aiSdrAutomated",
      "aiSdrSetupSystemPrompt",
      "aiSdrSetupPrompt",
      "defineIcpAndPersona",
      "typesAndSignals",
    ];
    const updatedFields: Record<string, any> = {};

    // Loop through the fieldsToUpdate array
    fieldsToUpdate.forEach((field) => {
      if (formValues[field] !== undefined) {
        updatedFields[field] = formValues[field];
      }
    });

    data = {
      ...data,
      ...updatedFields,
    };
    data.formData = formValues;
    setIsOpenEdit(false);
    handleAutoSelect(false);
    console.log("formvalues : " + JSON.stringify(formValues));
    console.log("handleapply : " + JSON.stringify(data.formData));
  };

  useEffect(() => {
    if (selectedWorkflow && selectedWorkflow.formOptions) {
      data.isFormField = true;
    }
    data.isRootUrlCorrect = isRootUrlCorrect;
  }, [selectedWorkflow]);

  useEffect(() => {
    // console.log("--- useEffctDataB: " + JSON.stringify(data.formData.messageField));
    // console.log("addAction useEffect: " + JSON.stringify(data.delayUnit));
    if (data.delayUnit) {
      setValue("delayUnit", data.delayUnit);
      // data.formData.value = data.delayUnit.value;
      data.formData.value = {
        label: data.delayUnit.label,
        value: data.delayUnit.value,
      };

      // if (applyButtonRef.current) {
      //   applyButtonRef.current.click();
      // }
      // console.log("addAction useEffect after set: " + JSON.stringify(data.formData));
      // setTimeout(() => {
      // }, 0);
    }
    // if (data.delayValue) {
    //   setValue("delayValue", data.delayValue);
    //   data.formData.delayValue = data.delayValue;
    // }
    // if (data.messageField) {
    //   setValue("messageField", data.messageField);
    // }
    // if (data.profileNumber) {
    //   setValue("profileNumber", data.profileNumber);
    // }
    // if (data.searchURL) {
    //   setValue("searchURL", data.searchURL);
    // }
    const fieldsToUpdate = [
      "searchURL",
      "profileNumber",
      "messageField",
      "delayValue",
      "withdrawal",
      "link",
      "numberOfMembers",
      "commentersUsage",
      "reactionType",
      "proficiency",
      "relationship",
      "extractProfileNumber",
      "websiteSearchURL",
      "location",
      "industry",
      "companySize",
      "technologyUsage",
      "companyName",
      "jobTitle",
      "groupUrl",
      "templateId",
      "mailboxId",
      "isRotating",
      "aiSdrPitchCTAId",
      "aiSdrField",
      "aiSdrAdditionalInfoField",
      "aiSdrObjectionsField",
      "aiSdrCompetitionsField",
      "aiSdrAutomated",
      "aiSdrSetupSystemPrompt",
      "aiSdrSetupPrompt",
      "defineIcpAndPersona",
      "typesAndSignals",
    ];
    type FieldsToUpdate = (typeof fieldsToUpdate)[number];

    fieldsToUpdate.forEach((fieldName: FieldsToUpdate) => {
      if (data[fieldName as keyof NodeData]) {
        setValue(fieldName, data[fieldName as keyof NodeData]);
        // Optionally update formData if needed
        data.formData[fieldName as keyof NodeData] = data[fieldName as keyof NodeData];
      }
    });
    data.formData.messageField = data.messageField;
    // console.log("--- useEffctDataA: " + JSON.stringify(data.formData));
  }, [data, builderMessage, builderEmail, builderAiSdr, builderAiSdrSetup]);

  useEffect(() => {
    setSelectedOption(data.label);
    // console.log("addAction useEffect2: " + JSON.stringify(data));
  }, [data.label, data]);
  useEffect(() => {
    // if (builderMessage && !!builderMessage?.message?.length) {
    if (builderMessage) {
      if (
        selectedWorkflow &&
        (selectedWorkflow.title == "Linkedin Connection Request" ||
          selectedWorkflow.title == "Linkedin Message Sender")
      ) {
        if (builderMessage.id === id) {
          data.messageField = builderMessage.message;
          data.formData = { messageField: builderMessage.message };
          data.formData.messageField = builderMessage.message;
          data.imageUrl = builderMessage.imgurl;
          data.formData = { imageUrl: builderMessage.imgurl };
        }
      }
    } else if (builderEmail) {
      // console.log("typing in email builder");
      if (selectedWorkflow?.title == "Send Mail") {
        if (builderEmail.id === id) {
          data.formData = { templateId: builderEmail.templateId };
          data.formData = { mailboxId: builderEmail.mailboxId };
          data.formData = { isRotating: builderEmail.isRotating };
          data.templateId = builderEmail.templateId;
          data.mailboxId = builderEmail.mailboxId;
          data.isRotating = builderEmail.isRotating;
        }
      }
    } else if (builderAiSdr) {
      // console.log("typing in email builder");
      if (selectedWorkflow?.title == "AI SDR") {
        if (builderAiSdr.id === id) {
          data.formData = { aiSdrPitchCTAId: builderAiSdr.aiSdrPitchCTAId };
          data.formData = { aiSdrField: builderAiSdr.aiSdrField };
          data.formData = { aiSdrAdditionalInfoField: builderAiSdr.aiSdrAdditionalInfoField };
          data.formData = { aiSdrObjectionsField: builderAiSdr.aiSdrObjectionsField };
          data.formData = { aiSdrCompetitionsField: builderAiSdr.aiSdrCompetitionsField };
          data.formData = { aiSdrAutomated: builderAiSdr.aiSdrAutomated };
          data.aiSdrPitchCTAId = builderAiSdr.aiSdrPitchCTAId;
          data.aiSdrField = builderAiSdr.aiSdrField;
          data.aiSdrAdditionalInfoField = builderAiSdr.aiSdrAdditionalInfoField;
          data.aiSdrObjectionsField = builderAiSdr.aiSdrObjectionsField;
          data.aiSdrCompetitionsField = builderAiSdr.aiSdrCompetitionsField;
          data.aiSdrAutomated = builderAiSdr.aiSdrAutomated;
        }
      } else if (selectedWorkflow?.title == "AI SDR Linkedin") {
        if (builderAiSdr.id === id) {
          data.formData = { aiSdrPitchCTAId: builderAiSdr.aiSdrPitchCTAId };
          data.formData = { aiSdrField: builderAiSdr.aiSdrField };
          data.formData = { aiSdrAdditionalInfoField: builderAiSdr.aiSdrAdditionalInfoField };
          data.formData = { aiSdrObjectionsField: builderAiSdr.aiSdrObjectionsField };
          data.formData = { aiSdrCompetitionsField: builderAiSdr.aiSdrCompetitionsField };
          data.formData = { aiSdrAutomated: builderAiSdr.aiSdrAutomated };
          data.aiSdrPitchCTAId = builderAiSdr.aiSdrPitchCTAId;
          data.aiSdrField = builderAiSdr.aiSdrField;
          data.aiSdrAdditionalInfoField = builderAiSdr.aiSdrAdditionalInfoField;
          data.aiSdrObjectionsField = builderAiSdr.aiSdrObjectionsField;
          data.aiSdrCompetitionsField = builderAiSdr.aiSdrCompetitionsField;
          data.aiSdrAutomated = builderAiSdr.aiSdrAutomated;
        }
      } else if (selectedWorkflow?.title == "AISDR Linkedin") {
        if (builderAiSdrSetup.id === id) {
          data.formData = { aiSdrSetupSystemPrompt: builderAiSdrSetup.aiSdrSetupSystemPrompt };
          data.formData = { aiSdrSetupPrompt: builderAiSdrSetup.aiSdrSetupPrompt };
          data.aiSdrSetupSystemPrompt = builderAiSdrSetup.aiSdrSetupSystemPrompt;
          data.aiSdrSetupPrompt = builderAiSdrSetup.aiSdrSetupPrompt;
        }
      } else if (selectedWorkflow?.title == "AISDR Mail") {
        if (builderAiSdrSetup.id === id) {
          data.formData = { aiSdrSetupSystemPrompt: builderAiSdrSetup.aiSdrSetupSystemPrompt };
          data.formData = { aiSdrSetupPrompt: builderAiSdrSetup.aiSdrSetupPrompt };
          data.aiSdrSetupSystemPrompt = builderAiSdrSetup.aiSdrSetupSystemPrompt;
          data.aiSdrSetupPrompt = builderAiSdrSetup.aiSdrSetupPrompt;
        }
      }
    } else {
      // setShouldRerender(false);
      if (data?.delayUnit) {
        setValue("delayUnit", data.delayUnit);
        data.formData.value = {
          label: data.delayUnit.label,
          value: data.delayUnit.value,
        };
      }
      data.formData.delayValue = data?.delayValue;
      setShouldRerender(true);
    }
    // console.log("--- builder data" + JSON.stringify(data));
  }, [builderMessage, builderEmail, builderAiSdr, builderAiSdrSetup]);

  useEffect(() => {
    data.formData.messageField = data.messageField;
  }, [data.formData.messageField, builderMessage?.message]);

  // useEffect(() => {
  //   console.log("builder email in action node : " + JSON.stringify(builderEmail));
  // }, [builderEmail]);

  const menuList = useMemo(() => {
    const list = data?.menuData?.map((item: any) => ({
      label: item?.name,
      value: item?.name,
      icon: item?.icon,
      submenus: item?.submenus,
    }));
    return list;
  }, [data.menuData]);
  useEffect(() => {
    // console.log("isnewnode " + isNewNode);
    // Check if this is a new node and it's a LinkedIn connection request
    if (
      isNewNode &&
      selectedWorkflow &&
      (selectedWorkflow.title == "Linkedin Connection Request" ||
        selectedWorkflow.title == "Linkedin Message Sender")
    ) {
      dispatch(setBuilderScreenMode(false));
      dispatch(
        setValueBuilderMessage({
          id: id,
          message: data.messageField,
          label: data.label ?? "",
          imgurl: data.imageUrl,
        })
      );
      setIsNewNode(false);
    }
    if (isNewNode && selectedWorkflow && selectedWorkflow.title == "Send Mail") {
      dispatch(setBuilderScreenMode(false));
      dispatch(
        setValueBuilderEmail({
          id: id,
          templateId: data.templateId,
          mailboxId: data.mailboxId,
          isRotating: data.isRotating,
        })
      );
      setIsNewNode(false);
    }
    if (isNewNode && selectedWorkflow && selectedWorkflow.title == "AI SDR") {
      dispatch(setBuilderScreenMode(false));
      dispatch(
        setValueBuilderAiSdr({
          id: id,
          aiSdrPitchCTAId: data.aiSdrPitchCTAId,
          aiSdrField: data.aiSdrField,
          aiSdrAdditionalInfoField: data.aiSdrAdditionalInfoField,
          aiSdrObjectionsField: data.aiSdrObjectionsField,
          aiSdrCompetitionsField: data.aiSdrCompetitionsField,
          aiSdrAutomated: data.aiSdrAutomated,
        })
      );
      setIsNewNode(false);
    }
    if (isNewNode && selectedWorkflow && selectedWorkflow.title == "AISDR Linkedin") {
      dispatch(setBuilderScreenMode(false));
      dispatch(
        setValueBuilderAiSdrSetup({
          id: id,
          aiSdrSetupSystemPrompt: data.aiSdrSetupSystemPrompt,
          aiSdrSetupPrompt: data.aiSdrSetupPrompt,
        })
      );
      setIsNewNode(false);
    }
    if (isNewNode && selectedWorkflow && selectedWorkflow.title == "AISDR Mail") {
      dispatch(setBuilderScreenMode(false));
      dispatch(
        setValueBuilderAiSdrSetup({
          id: id,
          aiSdrSetupSystemPrompt: data.aiSdrSetupSystemPrompt,
          aiSdrSetupPrompt: data.aiSdrSetupPrompt,
        })
      );
      setIsNewNode(false);
    }
    if (isNewNode && selectedWorkflow && selectedWorkflow.title == "AI SDR Linkedin") {
      dispatch(setBuilderScreenMode(false));
      dispatch(
        setValueBuilderAiSdr({
          id: id,
          aiSdrPitchCTAId: data.aiSdrPitchCTAId,
          aiSdrField: data.aiSdrField,
          aiSdrAdditionalInfoField: data.aiSdrAdditionalInfoField,
          aiSdrObjectionsField: data.aiSdrObjectionsField,
          aiSdrCompetitionsField: data.aiSdrCompetitionsField,
          aiSdrAutomated: data.aiSdrAutomated,
        })
      );
      setIsNewNode(false);
    }
  }, [isNewNode, data.label]);
  // console.log("add action " + JSON.stringify(data?.stats));
  const handlePositiveNumberChange = (value: any) => {
    const numberValue = Number(value);
    // If value is a valid number but less than 1, default to 1
    if (isNaN(numberValue) || numberValue <= 0) {
      return 1;
    }
    return value; // Return the value if it's a valid positive number
  };
  return (
    <div className='flex items-center justify-center h-40 rounded-bl-xl w-500'>
      {!data.isDelay ? (
        <div
          id='drag'
          onMouseOver={() => handleAutoSelect(true)}
          onMouseLeave={() => {
            if (!isOpenEdit) {
              handleAutoSelect(false);
            }
          }}
          className={`drag transition-all duration-200 flex items-center justify-center h-full text-white bg-primary rounded-bl-xl p-10`}
        >
          <RiDragMove2Fill className='w-20 h-20 text-white' />
        </div>
      ) : (
        <div
          className={`drag transition-all duration-200 flex items-center justify-center h-full text-white bg-primary rounded-bl-xl p-10`}
        >
          <RiDragMove2Fill className='w-20 h-20 mx-5 text-white' />
          <GoStopwatch className='w-20 h-20 text-white' />
        </div>
      )}
      <Handle type='target' position={Position.Top} style={{ background: "#555", opacity: 0 }} />
      {!data?.isDelay ? (
        <MenuButtonBuilder
          button={
            <div
              className={`cursor-pointer h-full text-white items-center px-10 flex justify-center ${
                data.isInitialNode || data.isDropDownDisabled ? "bg-primary" : "bg-gray-400"
              } ${
                data.isInitialNode
                  ? selectedWorkflow && selectedWorkflow.formOptions
                    ? ""
                    : "rounded-tr-lg pr-20"
                  : ""
              }`}
            >
              <p className='px-6'>
                {selectedOption === "Add Action" ? (
                  selectedOption
                ) : (
                  <span className='flex items-center'>
                    {data.isOnStep && <span>{data.isOnStep}. </span>}
                    <Icon
                      name={(selectedWorkflow?.icon as IconType) ?? "LogoBuilder"}
                      className={`w-40 h-40 text-white rounded-full ${
                        selectedWorkflow?.icon === "LogoBuilder" ? "p-8" : "p-4"
                      }`}
                    />
                    {selectedOption == "1-1" ? "1-1 Personalization" : selectedOption}
                  </span>
                )}
                {/* `${
                       data.isOnStep ? data.isOnStep + ". " : ""
                     } <Icon name={selectedWorkflow.icon ?? "Logo"} className='w-40 h-40 p-5 text-[#2285E1]' /> ${selectedOption}`} */}
              </p>
            </div>
          }
          disabled={data.isDropDownDisabled}
          onChange={(val: string) => {
            // console.log("val coming: " + val);
            handleOptionClick(val);
          }}
          menuList={menuList}
        />
      ) : (
        <div
          className={`cursor-pointer h-full text-white items-center px-10 flex justify-center ${
            data.isInitialNode || data.isDropDownDisabled ? "bg-primary" : "bg-gray-400"
          } ${data.isInitialNode && !data.isDropDownDisabled ? "rounded-tr-lg pr-20" : ""}`}
        >
          <p className='px-6'>
            {/* Step {data.isOnStep ? data.isOnStep : ""}
            {" - "} */}
            {data.delayValue ? `Wait for ${data.delayValue} ${data.delayUnit?.value}` : "Delay"}
          </p>
        </div>
      )}
      <Handle type='source' position={Position.Bottom} style={{ background: "#555", opacity: 0 }} />
      {!data.isInitialNode && !data?.isDelay && (
        <div
          id='delete'
          className={`transition-all duration-200 cursor-pointer bg-error-1 h-full text-white flex justify-center items-center px-11 ${
            !data.isDropDownDisabled ||
            !(data.isDropDownDisabled && selectedWorkflow && selectedWorkflow.formOptions)
              ? "rounded-tr-lg"
              : ""
          } `}
        >
          <GoTrash id='delete' className='w-20 h-20 text-white' />
        </div>
      )}
      {data.isDropDownDisabled && selectedWorkflow && selectedWorkflow.formOptions && (
        <Popover className='relative flex items-center justify-center h-full'>
          <Popover.Button
            className='h-full outline-none'
            onClick={(event) => {
              event.preventDefault();
              if (
                selectedWorkflow?.title == "Linkedin Connection Request" ||
                selectedWorkflow?.title == "Linkedin Message Sender"
              ) {
                dispatch(setBuilderScreenMode(false));
                dispatch(
                  setValueBuilderMessage({
                    id: id,
                    message: data.messageField,
                    imgurl: data.imageUrl,
                    label: data.label ?? "",
                  })
                );
              } else if (selectedWorkflow?.title == "Send Mail") {
                dispatch(setBuilderScreenMode(false));
                dispatch(
                  setValueBuilderEmail({
                    id: id,
                    templateId: data.templateId,
                    mailboxId: data.mailboxId,
                    isRotating: data.isRotating,
                  })
                );
              } else if (selectedWorkflow?.title == "AI SDR") {
                dispatch(setBuilderScreenMode(false));
                dispatch(
                  setValueBuilderAiSdr({
                    id: id,
                    aiSdrPitchCTAId: data.aiSdrPitchCTAId,
                    aiSdrField: data.aiSdrField,
                    aiSdrAdditionalInfoField: data.aiSdrAdditionalInfoField,
                    aiSdrObjectionsField: data.aiSdrObjectionsField,
                    aiSdrCompetitionsField: data.aiSdrCompetitionsField,
                    aiSdrAutomated: data.aiSdrAutomated,
                  })
                );
              } else if (selectedWorkflow?.title == "AISDR Linkedin") {
                dispatch(setBuilderScreenMode(false));
                dispatch(
                  setValueBuilderAiSdrSetup({
                    id: id,
                    aiSdrSetupSystemPrompt: data.aiSdrSetupSystemPrompt,
                    aiSdrSetupPrompt: data.aiSdrSetupPrompt,
                  })
                );
              } else if (selectedWorkflow?.title == "AISDR Mail") {
                dispatch(setBuilderScreenMode(false));
                dispatch(
                  setValueBuilderAiSdrSetup({
                    id: id,
                    aiSdrSetupSystemPrompt: data.aiSdrSetupSystemPrompt,
                    aiSdrSetupPrompt: data.aiSdrSetupPrompt,
                  })
                );
              } else if (selectedWorkflow?.title == "AI SDR Linkedin") {
                dispatch(setBuilderScreenMode(false));
                dispatch(
                  setValueBuilderAiSdr({
                    id: id,
                    aiSdrPitchCTAId: data.aiSdrPitchCTAId,
                    aiSdrField: data.aiSdrField,
                    aiSdrAdditionalInfoField: data.aiSdrAdditionalInfoField,
                    aiSdrObjectionsField: data.aiSdrObjectionsField,
                    aiSdrCompetitionsField: data.aiSdrCompetitionsField,
                    aiSdrAutomated: data.aiSdrAutomated,
                  })
                );
              } else {
                setIsOpenEdit((prev) => !prev);
              }
              handleAutoSelect(true);
            }}
          >
            <div
              onMouseOver={() => handleAutoSelect(true)}
              onMouseLeave={() => {
                if (!isOpenEdit) {
                  handleAutoSelect(false);
                }
              }}
              id='configure'
              className={`flex items-center justify-center h-full text-white rounded-tr-lg cursor-pointer bg-primary px-10`}
            >
              {selectedWorkflow?.title == "Linkedin Connection Request" ||
              selectedWorkflow?.title == "Linkedin Message Sender" ||
              selectedWorkflow?.title == "Send Mail" ||
              selectedWorkflow?.title == "AI SDR" ||
              selectedWorkflow?.title == "AI SDR Linkedin" ? (
                <BiMessageDetail className='w-20 h-20 text-white' />
              ) : (
                <Icon id='configure' name='EllipsisVertical' className='w-20 h-20 text-white' />
              )}
            </div>
          </Popover.Button>
          <Transition show={isOpenEdit}>
            <Popover.Panel
              onClick={(event) => event?.stopPropagation()}
              className={`absolute left-0 z-50 p-10  border rounded-md shadow-xl select-none  bg-contentColor dark:bg-contentColor-dark border-bodyBgColor dark:border-borderColor-dark  ${
                data.isInitialNode ? "-top-20" : "-translate-y-1/2 top-1/2"
              } ${data?.isDelay ? "translate-x-45 !-top-0" : "translate-x-50"}`}
              ref={ref}
            >
              <form
                className='flex flex-col gap-6 py-6 nowheel w-250'
                onSubmit={handleSubmit(handleApply)}
              >
                {selectedWorkflow.formOptions
                  ? selectedWorkflow.formOptions.map((field: any, index) => (
                      <div key={index}>
                        {field?.inputId ? (
                          <>
                            <Input
                              type={field?.type ?? "text"}
                              label={field.title + " " + field.tip}
                              placeholder={field.placeholder || ""}
                              id={field.inputId || ""}
                              register={register(field.inputId)}
                              style={{ border: isRootUrlCorrect ? "" : "1px solid red" }}
                            />
                          </>
                        ) : null}
                        {selectedWorkflow.title == "Delay" && field?.selectId ? (
                          <div>
                            <ReactSelectRh
                              label='Delay'
                              placeholder='Delay'
                              options={delayUnit}
                              name='delayUnit'
                              control={control}
                              handleChange={handlePositiveNumberChange}
                            />
                          </div>
                        ) : null}
                        {(selectedWorkflow.title == "Linkedin Post Likes" ||
                          selectedWorkflow.title == "Linkedin Post Commenters") &&
                        field.selectId ? (
                          <div className='flex flex-col gap-10 w-200'>
                            <ReactSelectRh
                              label={field.title}
                              placeholder={field.placeholder}
                              options={
                                selectedWorkflow.title == "Linkedin Post Likes"
                                  ? likedPostsUsageArray
                                  : commentsUsageArray
                              }
                              name={field.selectId}
                              control={control}
                              // handleChange={(val: ISelectOption) =>
                              //   setValue(field.selectId, val?.value.value)
                              // }
                            />
                          </div>
                        ) : null}
                      </div>
                    ))
                  : null}
                <div className='flex justify-center w-full gap-10 pt-10'>
                  {/* <Button className='!py-5' type='submit' disabled={isFillFormValues}>
                   */}
                  <Button className='!py-5' type='submit'>
                    Apply
                  </Button>
                  <Button
                    className='!py-5'
                    buttonStyle='secondary'
                    onClick={() => {
                      setIsOpenEdit(false);
                      handleAutoSelect(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Popover.Panel>
          </Transition>
        </Popover>
      )}
      {/* {data?.stats && data.showStats ? (
        <div className='text-neutral-800 dark:text-neutral-400 text-16 p-10'>
          <div>Completed: {data?.stats.completed}</div>
          <div>Queued: {data?.stats.pending}</div>
          <div>Failed: {data?.stats.failed}</div>
        </div>
      ) : null} */}
    </div>
  );
};

export default AddActionNode;
