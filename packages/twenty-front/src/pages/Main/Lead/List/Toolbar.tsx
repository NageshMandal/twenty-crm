import React, { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "react-toastify";

import AddToListModal from "../module/AddToListModal";
import AutomationModal from "../module/AutomationModal";
import Button from "src/components/base/Button";
import CSVModal from "../module/CSVModal";
import Icon from "src/components/base/Icon";
import LeadFilterModal from "./FilterModal";
import PopoverButton from "src/components/base/PopoverButton";
import SearchInput from "src/components/base/SearchInput";
import { OBJECT_TYPES } from "src/utils/constants/lead";
import { getAutomations, leadSelector } from "src/store/Leads";
import { leadApi } from "src/api/leads";
import { useAppDispatch, useAppSelector } from "src/hook/redux/useStore";
import { useExportCSV } from "src/hook/lead/useExportCSV";
import { useTags } from "src/hook/lead/useTags";
import {
  IExportCSV,
  IProspect,
  IReqLead,
  IResAddAutomation,
  ITemplate,
} from "src/utils/types/leads";
import TagsModal from "src/components/base/TagsModal";

type Props = {
  selectedProspects: IProspect[];
  totalLeads: number;
  userId?: number;
  setFilter?: Function;
  filter: string;
  grandTotalLeads?: number;
};

const Toolbar: React.FC<Props> = ({
  selectedProspects,
  totalLeads,
  userId,
  setFilter,
  filter,
  grandTotalLeads,
}) => {
  const dispatch = useAppDispatch();
  const { control, reset } = useForm();
  const {
    control: csvControl,
    register: csvRegister,
    reset: csvReset,
    watch: csvWatch,
    setValue: csvSetValue,
  } = useForm();

  const { automations } = useAppSelector(leadSelector);

  const [showAutomationModal, setShowAutomationModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false);

  const { exportFields, templates, setTemplates } = useExportCSV();

  const [isAddAutomationLoading, setIsAddAutomationLoading] = useState(false);
  const selectedAutomations = useWatch({ control, name: "automations" });

  const [selectedLeadId, setSelectedLeadId] = useState<string[]>([]);
  const selectedTag = useWatch({ control, name: "tag" });

  const [isZapierLoading, setIsZapierLoading] = useState(false);
  const [isHubSpotLoading, setIsHubSpotLoading] = useState(false);
  const watchFields = csvWatch();
  const [showCSVModal, setShowCSVModal] = useState(false);

  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [isCSVLoading, setCSVLoading] = useState(false);

  const { tags, tagOptions, handleGetTags } = useTags();
  const [isAddListPending, setIsListPending] = useState<boolean>(false);

  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showTagsModal, setShowTagsModal] = useState(false);

  const selectedFields = useMemo(() => {
    const result: string[] = [];
    Object.entries(watchFields)?.forEach(([key, value]) => {
      if (value === true) {
        result.push(key);
      }
    });
    return result;
  }, [watchFields]);

  useEffect(() => {
    if (selectedProspects.length) {
      const result = selectedProspects?.map((item) => item.id);
      setSelectedLeadId(result);
    }
  }, [selectedProspects]);

  const handleAutomations = async () => {
    setIsAddAutomationLoading(true);
    try {
      if (JSON.stringify(selectedAutomations)?.length) {
        const req: IReqLead = {
          all: false,
          ids: selectedLeadId,
          query: `@user_id in ${userId}`,
          wid: selectedAutomations.id,
        };
        const res = (await leadApi.addAutomation(req)) as unknown as IResAddAutomation;
        if (res?.added === 0) {
          toast.error(`Prospect can't be added more than once `);
        } else if (res?.added && res?.added !== 0) {
          toast.success(`${res?.added} contacts successfully added`);
        }
      } else {
        toast.warn("Automation is required filed!");
      }
    } catch (error) {
      console.error("error: ", error);
    }
    setIsAddAutomationLoading(false);
    setShowAutomationModal(false);
  };

  const handleAddList = async () => {
    setIsListPending(true);
    try {
      if (JSON.stringify(selectedTag)?.length) {
        const req = {
          filter: {
            all: false,
            ids: selectedLeadId,
            query: `@user_id in ${userId}`,
          },
          tags: [selectedTag.id],
        };
        await leadApi.addListByTag(req);
        toast.success(`Successfully added!`);
        setShowListModal(false);
      } else {
        toast.warn("Tag is required filed!");
      }
    } catch (error) {
      console.error("error: ", error);
    }
    setIsListPending(false);
  };

  const handleZapier = async () => {
    setIsZapierLoading(true);
    try {
      const req: IReqLead = {
        all: false,
        ids: selectedLeadId,
        query: `@user_id in ${userId}`,
      };
      await leadApi.handleZapier(req);
      toast.success(`Exported successfully!`);
    } catch (error) {
      console.error("error: ", error);
    }
    setIsZapierLoading(false);
    setSelectedLeadId([]);
  };

  const handleHubSpot = async () => {
    setIsHubSpotLoading(true);
    try {
      const req: IReqLead = {
        all: false,
        ids: selectedLeadId,
        query: `@user_id in ${userId}`,
      };
      await leadApi.handleHubSpot(req);
      toast.success(`Exported successfully!`);
    } catch (error) {
      console.error("error: ", error);
    }
    setIsHubSpotLoading(false);
    setSelectedLeadId([]);
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
          ids: selectedLeadId,
          query: `@user_id in ${userId}`,
        },
      };
      await leadApi.exportCSV(req);
      toast.success("Exported successfully!");
    } catch (error) {
      console.error("error: ", error);
    }
    setCSVLoading(false);
    setShowCSVModal(false);
    setSelectedLeadId([]);
  };

  const handleGetAutomations = async () => {
    dispatch(getAutomations());
  };

  useEffect(() => {
    handleGetAutomations();
  }, []);

  const handleMyContacts: React.MouseEventHandler<HTMLDivElement> = (event) => {
    toast.success("Success!");
  };

  const handleMyCompanies: React.MouseEventHandler<HTMLDivElement> = (event) => {
    toast.success("Success!");
  };

  const handleTags: React.MouseEventHandler<HTMLDivElement> = (event) => {
    setShowFilterModal(false);
    setShowTagsModal(true);
  };

  const handleStages: React.MouseEventHandler<HTMLDivElement> = (event) => {
    toast.success("Success!");
  };

  const handleImportCSV: React.MouseEventHandler<HTMLDivElement> = (event) => {
    toast.success("Success!");
  };

  const handleExportHistory: React.MouseEventHandler<HTMLDivElement> = (event) => {
    toast.success("Success!");
  };

  return (
    <>
      <TagsModal
        show={showTagsModal}
        onClose={() => setShowTagsModal(false)}
        tags={tags}
        handleGetTags={handleGetTags}
      ></TagsModal>
      <div className='flex flex-wrap items-center justify-between w-full gap-20 pb-35'>
        <div className='flex items-center gap-20'>
          <h2 className='font-normal select-none whitespace-nowrap text-25 text-neutral-800 dark:text-neutral-300'>
            My Leads
          </h2>
          <SearchInput />
          <p className='pl-10 font-normal text-16 whitespace-nowrap text-primary'>
            {!!filter.length ? "Filtered Leads" : "Leads"}: {totalLeads ?? 0} / {"Total Leads: "}{" "}
            {grandTotalLeads ?? 0}
          </p>
        </div>
        <div className='flex gap-20 '>
          <Button
            rounded
            buttonStyle='secondary'
            prefix='Plus'
            onClick={() => {
              if (selectedProspects.length) {
                setShowAutomationModal(true);
                reset();
              } else {
                toast.warn("Please select Prospects");
              }
            }}
          >
            Add to Automation
          </Button>
          <Button
            onClick={() => {
              if (selectedProspects.length) {
                setShowListModal(true);
                reset();
              } else {
                toast.warn("Please select Prospects");
              }
            }}
            rounded
            buttonStyle='secondary'
            prefix='Plus'
            suffix='ChevronDown'
          >
            Add to My Lists
          </Button>
          <PopoverButton
            button={
              <div className='flex items-center justify-center w-auto font-normal text-white transition-all duration-200 border border-transparent rounded-full select-none large:w-170 drop-shadow-sm focus:outline-none py-9 large:px-18 px-14 text-14 min-w-80 bg-primary hover:bg-primary-2 focus:bg-primary'>
                <p className='select-none whitespace-nowrap'>Export to</p>
              </div>
            }
          >
            <div className='flex flex-col gap-8'>
              <Button
                onClick={() => {
                  if (selectedProspects.length) {
                    handleZapier();
                  } else {
                    toast.warn("Please select Prospects");
                  }
                }}
                isPending={isZapierLoading}
                prefix='Zapier'
                fullWidth
                buttonStyle='secondary'
              >
                Zapier
              </Button>
              <Button
                onClick={() => {
                  if (selectedProspects.length) {
                    handleHubSpot();
                  } else {
                    toast.warn("Please select Prospects");
                  }
                }}
                isPending={isHubSpotLoading}
                prefix='HubSpot'
                fullWidth
                buttonStyle='secondary'
              >
                HubSpot
              </Button>
              <Button
                onClick={() => {
                  if (selectedProspects.length) {
                    csvReset();
                    setShowCSVModal(true);
                  } else {
                    toast.warn("Please select Prospects");
                  }
                }}
                buttonStyle='secondary'
              >
                Export to CSV
              </Button>
            </div>
          </PopoverButton>
          <div
            className='flex items-center gap-12 pl-30'
            role='button'
            onClick={() => setShowFilterModal(true)}
          >
            <Icon
              name='Column'
              className={`flex-none w-20 h-20  ${
                !!filter.length ? "fill-primary" : "fill-neutral-600 dark:fill-neutral-300"
              }`}
            />
            <Icon
              name='ChevronDown'
              className={`flex-none w-16 h-16 ${
                !!filter.length ? "text-primary" : "text-neutral-800 dark:text-neutral-300"
              }`}
            />
          </div>
        </div>
      </div>
      <AutomationModal
        automations={automations}
        handleAutomations={() => handleAutomations()}
        open={showAutomationModal}
        control={control}
        onClose={() => setShowAutomationModal(false)}
        selectedProspects={selectedProspects}
        isAddAutomationLoading={isAddAutomationLoading}
      />
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
      <AddToListModal
        open={showListModal}
        onClose={() => setShowListModal(false)}
        control={control}
        handleAddList={() => handleAddList()}
        isAddListPending={isAddListPending}
        selectedProspects={selectedProspects}
        tags={tags}
      />
      <LeadFilterModal
        onClose={() => setShowFilterModal(false)}
        open={showFilterModal}
        tagOptions={tagOptions}
        setFilter={setFilter}
        handleMyContacts={(event) => handleMyContacts(event)}
        handleMyCompanies={(event) => handleMyCompanies(event)}
        handleTags={(event) => handleTags(event)}
        handleStages={(event) => handleStages(event)}
        handleImportCSV={(event) => handleImportCSV(event)}
        handleExportHistory={(event) => handleExportHistory(event)}
      />
    </>
  );
};

export default Toolbar;
