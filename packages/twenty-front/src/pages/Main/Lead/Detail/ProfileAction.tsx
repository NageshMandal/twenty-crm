import React, { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "react-toastify";

import AutomationModal from "../module/AutomationModal";
import Button from "src/components/base/Button";
import CSVModal from "../module/CSVModal";
import Icon from "src/components/base/Icon";
import PopoverButton from "src/components/base/PopoverButton";
import { IReqLead, IResAddAutomation, ITemplate, IExportCSV } from "src/utils/types/leads";
import { OBJECT_TYPES } from "src/utils/constants/lead";
import { authSelector } from "src/store/Auth";
import { leadApi } from "src/api/leads";
import { leadSelector } from "src/store/Leads";
import { useAppSelector } from "src/hook/redux/useStore";
import { useExportCSV } from "src/hook/lead/useExportCSV";

const ProfileAction: React.FC = () => {
  const { control: automationControl } = useForm();
  const {
    control: csvControl,
    register: csvRegister,
    reset: csvReset,
    watch: csvWatch,
    setValue: csvSetValue,
  } = useForm();

  const { exportFields, templates, setTemplates } = useExportCSV();

  const { prospect, automations } = useAppSelector(leadSelector);
  const { userInfo } = useAppSelector(authSelector);

  const watchFields = csvWatch();
  const [showAutomationModal, setShowAutomationModal] = useState(false);
  const [showCSVModal, setShowCSVModal] = useState(false);

  const selectedAutomations = useWatch({ control: automationControl, name: "automations" });

  const selectedFields = useMemo(() => {
    const result: string[] = [];
    Object.entries(watchFields)?.forEach(([key, value]) => {
      if (value === true) {
        result.push(key);
      }
    });
    return result;
  }, [watchFields]);

  const [isAddAutomationLoading, setIsAddAutomationLoading] = useState(false);
  const [isHubSpotLoading, setIsHubSpotLoading] = useState(false);
  const [isZapierLoading, setIsZapierLoading] = useState(false);

  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [isCSVLoading, setCSVLoading] = useState(false);

  const [isPositivePending, setIsPositivePending] = useState(false);
  const [isNegativePending, setIsNegativePending] = useState(false);

  const selectedTemplate: ITemplate = useWatch({ control: csvControl, name: "template" });

  useEffect(() => {
    Object.keys(exportFields)?.forEach((item) => {
      csvSetValue(item, false);
    });
    selectedTemplate?.columns?.forEach((item) => {
      csvSetValue(item, true);
    });
  }, [selectedTemplate]);

  const handleAutomations = async () => {
    setIsAddAutomationLoading(true);
    try {
      if (JSON.stringify(selectedAutomations)?.length) {
        const req: IReqLead = {
          all: false,
          ids: prospect ? [prospect.id] : [],
          query: `@user_id in ${userInfo?.id}`,
          wid: selectedAutomations.id,
        };
        const res = (await leadApi.addAutomation(req)) as unknown as IResAddAutomation;
        if (res?.added === 0) {
          toast.error(`This prospect is already added`);
          setShowAutomationModal(false);
        } else if (res?.added && res?.added !== 0) {
          toast.success(`Prospect successfully added`);
          setShowAutomationModal(false);
        }
      } else {
        toast.warn("Automation is required filed!");
      }
    } catch (error) {
      setShowAutomationModal(false);
      console.error("error: ", error);
    }
    setIsAddAutomationLoading(false);
  };

  const handleHubSpot = async () => {
    setIsHubSpotLoading(true);
    try {
      const req: IReqLead = {
        all: false,
        ids: prospect ? [prospect.id] : [],
        query: `@user_id in ${userInfo?.id}`,
      };
      await leadApi.handleHubSpot(req);
      toast.success(`Exported successfully!`);
    } catch (error) {
      console.error("error: ", error);
    }
    setIsHubSpotLoading(false);
  };

  const handleZapier = async () => {
    setIsZapierLoading(true);
    try {
      const req: IReqLead = {
        all: false,
        ids: prospect ? [prospect.id] : [],
        query: `@user_id in ${userInfo?.id}`,
      };
      await leadApi.handleZapier(req);
      toast.success(`Exported successfully!`);
    } catch (error) {
      console.error("error: ", error);
    }
    setIsZapierLoading(false);
  };

  const handleSaveTemplate = async () => {
    setIsSaveLoading(true);
    try {
      const req: Partial<ITemplate> = {
        title: watchFields?.templateName,
        columns: selectedFields,
        file_type: 1,
        object_type: OBJECT_TYPES.prospects,
        sort: "recent",
      };
      const res = (await leadApi.saveTemplate(req)) as unknown as ITemplate;
      const newTemp = { ...res, name: res?.title };
      setTemplates((prev) => [...prev, newTemp]);
      csvSetValue("templateName", "");
      toast.success("Template successfully saved!");
      csvSetValue("template", newTemp);
    } catch (error) {
      console.error("error: ", error);
    }
    setIsSaveLoading(false);
  };

  const handleExportCSV = async () => {
    setCSVLoading(true);
    try {
      const req: IExportCSV = {
        columns: selectedFields,
        file_type: 1,
        optional_name: watchFields?.optionalName ?? "",
        object_type: OBJECT_TYPES.prospects,
        filter: {
          all: false,
          ids: [prospect ? prospect.id : ""],
          query: `@user_id in ${userInfo?.id}`,
        },
      };
      await leadApi.exportCSV(req);
      toast.success("Exported successfully!");
    } catch (error) {
      console.error("error: ", error);
    }
    setCSVLoading(false);
    setShowCSVModal(false);
  };

  const handlePositiveReply = async () => {
    setIsPositivePending(true);
    try {
      const req = {
        prospect_id: prospect?.id,
        status: "stop-sync",
      };
      await leadApi.handleReply(req);
      toast.success("Positive reply success");
    } catch (error) {
      toast.error(error?.response?.data?.message ?? error?.message);
    }
    setIsPositivePending(false);
  };

  const handleNegativeReply = async () => {
    setIsNegativePending(true);
    try {
      const req = {
        prospect_id: prospect?.id,
        status: "stop",
      };
      await leadApi.handleReply(req);
      toast.success("Negative reply success");
    } catch (error) {
      toast.error(error?.response?.data?.message ?? error?.message);
    }
    setIsNegativePending(false);
  };

  return (
    <>
      <div>
        <div className='flex gap-10'>
          <PopoverButton
            button={
              <div className='flex items-center justify-center w-auto font-normal text-white transition-all duration-200 border border-transparent rounded-full select-none large:w-170 drop-shadow-sm focus:outline-none py-9 large:px-18 px-14 text-14 min-w-80 bg-primary hover:bg-primary-2 focus:bg-primary'>
                <p className='select-none whitespace-nowrap'>Sync to CRM</p>
                <div className='flex-none pl-4 w-15 h-15'>
                  <Icon name='ChevronDown' className='flex-none text-white w-15 h-15' />
                </div>
              </div>
            }
          >
            <div className='flex flex-col gap-8'>
              <Button
                onClick={() => handleZapier()}
                isPending={isZapierLoading}
                prefix='Zapier'
                fullWidth
                buttonStyle='secondary'
              >
                Zapier
              </Button>
              <Button
                onClick={() => handleHubSpot()}
                isPending={isHubSpotLoading}
                prefix='HubSpot'
                fullWidth
                buttonStyle='secondary'
              >
                HubSpot
              </Button>
              <Button
                onClick={() => {
                  csvReset();
                  setShowCSVModal(true);
                }}
                buttonStyle='secondary'
              >
                Export to CSV
              </Button>
            </div>
          </PopoverButton>
          <Button
            rounded
            buttonStyle='secondary'
            prefix='Plus'
            onClick={() => setShowAutomationModal(true)}
          >
            Add to Automation
          </Button>
        </div>
        <div className='flex gap-10 pt-20'>
          <Button
            rounded
            buttonStyle='secondary'
            className='w-150'
            isPending={isNegativePending}
            onClick={() => handleNegativeReply()}
          >
            Negative Reply
          </Button>
          <Button
            rounded
            buttonStyle='secondary'
            className='w-150'
            isPending={isPositivePending}
            onClick={() => handlePositiveReply()}
          >
            Positive Reply
          </Button>
        </div>
      </div>
      {prospect ? (
        <AutomationModal
          automations={automations}
          handleAutomations={() => handleAutomations()}
          open={showAutomationModal}
          control={automationControl}
          onClose={() => setShowAutomationModal(false)}
          selectedProspects={[prospect]}
          isAddAutomationLoading={isAddAutomationLoading}
        />
      ) : null}
      <CSVModal
        open={showCSVModal}
        onClose={() => setShowCSVModal(false)}
        control={csvControl}
        register={csvRegister}
        exportFields={exportFields}
        handleExportCSV={() => handleExportCSV()}
        handleSaveTemplate={() => handleSaveTemplate()}
        isCSVLoading={isCSVLoading}
        isSaveLoading={isSaveLoading}
        selectedFields={selectedFields}
        templates={templates}
        watchFields={watchFields}
      />
    </>
  );
};

export default ProfileAction;
