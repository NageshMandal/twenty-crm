import { useEffect, useState } from "react";
import { FieldValues, useForm, useWatch } from "react-hook-form";

import Button from "../../../../../components/base/Button";
import Icon from "../../../../../components/base/Icon/index";
import { useLocation } from "../../../../../hooks/lead/useLocation";
import { ISelectOption } from "../../../../../utils/types";
import CompaniesToProspect from "./CompaniesToProspect";
import ContactLocation from "./ContactLocation";
import DepartmentHeadCount from "./DepartmentHeadCount";
import Functions from "./Functions";
import HeadCountGrowth from "./HeadCountGrowth";
import IncludeRecentlyHired from "./IncludeRecentlyHired";
import Industry from "./Industry";
import JobTitle from "./JobTitle";
import LandingPageUrl from "./LandingPageUrl";
import LocationHQ from "./LocationHQ";
import ManagementLevel from "./ManagementLevel";
import Personas from "./Personas";
import ProspectsPerCompanyPerUser from "./ProspectsPerCompany";
import TeamMembersToUseInCampaign from "./TeamMembersToUseInCampaign";
import Technology from "./Technology";
import UseDirectPathToProspect from "./UseDirectPathToProspect";
import VisitorIdentified from "./VisitorIdentified";

export interface FormData {
  location: string;
  industry: string;
  technology: string;
  teamMembers: string[];
  headCountGrowth: {
    min: number;
    max: number;
  };
  departmentHeadCount: {
    min: number;
    max: number;
  };
  departmentValue: {
    department: string;
  };
  managementLevel: string[];
  function: string[];
  personas: string[];
  includeRecentlyHired: boolean;
  contactLocation: string[];
  companiesToProspect: number;
  prospectsPerCompanyPerUser: number;
  useDirectPathToProspect: boolean;
  // directPathBySeniorityLevel: string;
  autopilotOutboundTurnedOn: boolean;
  autopilotRepliesTurnedOn: boolean;
  jobTitle: string;
  landingPageUrl: string;
  companySizeByEmployee: number;
  visitorIdentified: boolean;
}

const FromScratch = ({
  onNext,
  onPrevious,
  selectedBlockValue,
}: {
  onNext: (data: FormData) => void;
  onPrevious: () => void;
  selectedBlockValue: number;
}) => {
  console.log("selectedBlockValue " + selectedBlockValue);
  const [selectedBlock, setSelectedBlock] = useState<number>(selectedBlockValue);
  const [query, setQuery] = useState<string | null>(null); // Add state to hold query
  const { locationOption } = useLocation(query);

  const { control, handleSubmit } = useForm<FieldValues>();

  const [formData, setFormData] = useState<FormData>({
    location: "",
    industry: "",
    technology: "",
    teamMembers: [],
    headCountGrowth: {
      min: 0,
      max: 0,
    },
    departmentHeadCount: {
      min: 0,
      max: 0,
    },
    departmentValue: {
      department: "",
    },
    managementLevel: [],
    function: [],
    personas: [],
    includeRecentlyHired: false,
    contactLocation: [],
    companiesToProspect: 0,
    prospectsPerCompanyPerUser: 0,
    useDirectPathToProspect: false,
    visitorIdentified: false,
    // directPathBySeniorityLevel: "",
    autopilotOutboundTurnedOn: false,
    autopilotRepliesTurnedOn: false,
    jobTitle: "",
    landingPageUrl: "",
    companySizeByEmployee: 10,
  });

  const includeRecentlyHired = useWatch({
    control,
    name: "includeRecentlyHired",
    defaultValue: formData.includeRecentlyHired,
  });
  const useDirectPathToProspect = useWatch({
    control,
    name: "useDirectPathToProspect",
    defaultValue: formData.useDirectPathToProspect,
  });
  const visitorIdentified = useWatch({
    control,
    name: "visitorIdentified",
    defaultValue: formData.visitorIdentified,
  });
  // const directPathBySeniorityLevel = useWatch({
  //   control,
  //   name: "directPathBySeniorityLevel",
  //   defaultValue: formData.directPathBySeniorityLevel,
  // });
  const autopilotOutboundTurnedOn = useWatch({
    control,
    name: "autopilotOutboundTurnedOn",
    defaultValue: formData.autopilotOutboundTurnedOn,
  });
  const autopilotRepliesTurnedOn = useWatch({
    control,
    name: "autopilotRepliesTurnedOn",
    defaultValue: formData.autopilotRepliesTurnedOn,
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleMultiSelectInputChange = (e: { label: string; value: string }) => {
    if (formData[e.label].includes(e.value)) {
      setFormData({
        ...formData,
        [e.label]: formData[e.label].filter((value) => value !== e.value),
      });
    } else {
      setFormData({
        ...formData,
        [e.label]: [...formData[e.label], e.value],
      });
    }
  };
  const handleInputArrayChange = (e: { label: string; value: string[] }) => {
    setErrors({
      ...errors,
      [e.label]: "",
    });

    setFormData({
      ...formData,
      [e.label]: e.value.map((value) => value),
    });
  };

  const handleInputChange = (e: ISelectOption) => {
    setErrors({
      ...errors,
      [e.label]: "",
    });

    setFormData({
      ...formData,
      [e.label]: e.value,
    });
  };

  // const cityOptions = locationOption?.map((city) => ({
  //   label: city.label,
  //   value: city.value,
  // }));

  // useEffect(() => {
  //   setLocations(cityOptions);
  // }, [cityOptions]);

  useEffect(() => {
    // console.log("selectedBlockValue " + selectedBlock);
    setSelectedBlock(selectedBlockValue);
    // console.log("selectedBlockValue " + selectedBlock);
  }, []);

  const handleLocationInputChange = (e: ISelectOption) => {
    setErrors({
      ...errors,
      [e.label]: "",
    });

    setFormData({
      ...formData,
      [e.label]: e.value,
    });
    useLocation(e.value);
  };

  const handleMinMaxInputChange = (e: { label: string; min: number; max: number }) => {
    setFormData({
      ...formData,
      [e.label]: { min: e.min, max: e.max },
    });
  };

  const handleDepartmentChange = (value: string) => {
    setFormData({
      ...formData,
      departmentValue: { department: value },
    });
  };

  const validate = (): Partial<FormData> => {
    const validationErrors: Partial<FormData> = {};

    if (selectedBlock != 3) {
      if (!formData.location) {
        validationErrors.location = "Location HQ is required";
      }
      if (!formData.industry) {
        validationErrors.industry = "Industry is required";
      }
      if (!formData.jobTitle) {
        validationErrors.jobTitle = "Job Title is required";
      }
    }
    if (!formData.teamMembers.length) {
      validationErrors.teamMembers = ["Team Members is required"];
    }
    return validationErrors;
  };

  const onSubmit = () => {
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      const data = {
        ...formData,
        includeRecentlyHired,
        useDirectPathToProspect,
        visitorIdentified,
        // directPathBySeniorityLevel,
        autopilotOutboundTurnedOn,
        autopilotRepliesTurnedOn,
      };
      onNext(data);
    }
  };

  // const cityOptions = cities?.map((city) => ({
  //   label: city.name,
  //   value: city.name,
  // }));
  const handleInputChangeExternally = (newInputValue: string) => {
    setQuery(newInputValue); // Trigger update with typed value
  };

  return (
    <div className='w-full'>
      <div className='flex items-center gap-12 py-30 w-full'>
        <div className='p-12 overflow-hidden bg-primary-2 rounded-xl'>
          <Icon name='Building' className='w-20 h-20 text-white' />
        </div>
        <p className='text-neutral-800 dark:text-neutral-300 text-20'>
          Setup Targeted Accounts + their Personas
        </p>
      </div>
      <form className='w-1/2' onSubmit={handleSubmit(onSubmit)}>
        <div className='grid grid-cols-1 space-y-24'>
          {selectedBlock == 3 && (
            <>
              <div className='border-t border-gray-300 w-full' />
              <VisitorIdentified control={control} />
              <div className='border-t border-gray-300 w-full' />
              <LandingPageUrl
                value={
                  formData.landingPageUrl
                    ? {
                        label: formData.landingPageUrl,
                        value: formData.landingPageUrl,
                      }
                    : undefined
                }
                handleInputChange={handleInputChange}
              />
            </>
          )}
          <LocationHQ
            locations={locationOption}
            errors={errors.location}
            value={
              formData.location ? { label: formData.location, value: formData.location } : undefined
            }
            handleInputChange={handleLocationInputChange}
            handleInputChangeExternally={handleInputChangeExternally}
            selectedBlock={selectedBlock}
          />
          <div className='border-t border-gray-300 w-full' />
          <Industry
            errors={errors.industry}
            value={
              formData.industry ? { label: formData.industry, value: formData.industry } : undefined
            }
            handleInputChange={handleInputChange}
            selectedBlock={selectedBlock}
          />
          <div className='border-t border-gray-300 w-full' />
          <Technology
            value={
              formData.technology
                ? { label: formData.technology, value: formData.technology }
                : undefined
            }
            handleInputChange={handleInputChange}
          />
          <div className='border-t border-gray-300 w-full' />
          <JobTitle
            value={
              formData.jobTitle
                ? {
                    label: formData.jobTitle,
                    value: formData.jobTitle,
                  }
                : undefined
            }
            handleInputChange={handleInputChange}
            errors={errors.location}
          />
          {selectedBlock == 3 && (
            <>
              {/* <div className='border-t border-gray-300 w-full' />
              <CompanySizeByEmployee
                value={
                  formData.companySizeByEmployee
                    ? {
                        label: formData.companySizeByEmployee,
                        value: formData.companySizeByEmployee,
                      }
                    : undefined
                }
                handleInputChange={handleInputChange}
              /> */}
            </>
          )}
          {selectedBlock != 3 && (
            <>
              <div className='border-t border-gray-300 w-full' />
              <HeadCountGrowth
                value={formData.headCountGrowth}
                handleInputChange={handleMinMaxInputChange}
              />
              <div className='border-t border-gray-300 w-full' />
              <DepartmentHeadCount
                depValue={formData.departmentValue}
                value={formData.departmentHeadCount}
                handleInputChange={handleMinMaxInputChange}
                handleDepartmentChange={handleDepartmentChange}
              />
              <div className='border-t border-gray-300 w-full' />
              <ManagementLevel
                value={
                  formData.managementLevel
                    ? formData.managementLevel.map((managementLevelItem) => {
                        return { label: managementLevelItem, value: managementLevelItem };
                      })
                    : undefined
                }
                handleInputChange={handleMultiSelectInputChange}
              />
              <div className='border-t border-gray-300 w-full' />
              <Functions
                value={
                  formData.function
                    ? formData.function.map((functionItem) => {
                        return { label: functionItem, value: functionItem };
                      })
                    : undefined
                }
                handleInputChange={handleMultiSelectInputChange}
              />
              <div className='border-t border-gray-300 w-full' />
              <Personas
                value={
                  formData.personas
                    ? formData.personas.map((persona) => {
                        return { label: persona, value: persona };
                      })
                    : undefined
                }
                handleInputChange={handleInputArrayChange}
              />
              <div className='border-t border-gray-300 w-full' />
              <IncludeRecentlyHired control={control} />
              <div className='border-t border-gray-300 w-full' />
              <ContactLocation
                locations={locationOption}
                value={
                  formData.contactLocation
                    ? formData.contactLocation.map((contactLocation) => {
                        return { label: contactLocation, value: contactLocation };
                      })
                    : undefined
                }
                handleInputChange={handleInputArrayChange}
              />
              <div className='border-t border-gray-300 w-full' />
              <CompaniesToProspect
                value={
                  formData.companiesToProspect
                    ? { label: formData.companiesToProspect, value: formData.companiesToProspect }
                    : undefined
                }
                handleInputChange={handleInputChange}
                selectedBlock={selectedBlock}
              />
            </>
          )}
          {(selectedBlock == 3 || selectedBlock == 2) && (
            <>
              <div className='border-t border-gray-300 w-full' />
              <ProspectsPerCompanyPerUser
                value={
                  formData.prospectsPerCompanyPerUser
                    ? {
                        label: formData.prospectsPerCompanyPerUser,
                        value: formData.prospectsPerCompanyPerUser,
                      }
                    : undefined
                }
                handleInputChange={handleInputChange}
                selectedBlock={selectedBlock}
              />
            </>
          )}
          {selectedBlock != 3 && (
            <>
              <div className='border-t border-gray-300 w-full' />
              <UseDirectPathToProspect control={control} />
              <div className='border-t border-gray-300 w-full' />
              {/* <DirectPathBySeniorityLevel control={control} />
              <div className='border-t border-gray-300 w-full' /> */}
              {/* <AutopilotOutboundTurnedOn control={control} />
              <div className='border-t border-gray-300 w-full' />
              <AutopilotRepliesTurnedOn control={control} /> */}
            </>
          )}
          <div className='border-t border-gray-300 w-full' />
          <TeamMembersToUseInCampaign
            errors={errors.teamMembers ? errors.teamMembers[0] : ""}
            value={
              formData.teamMembers
                ? formData.teamMembers.map((teamMember) => {
                    return { label: teamMember, value: teamMember };
                  })
                : undefined
            }
            handleInputChange={handleInputArrayChange}
          />
        </div>
        <div className='flex justify-center gap-20 pt-90 '>
          <Button className='w-125' buttonStyle='secondary' onClick={onPrevious}>
            Back
          </Button>
          <Button className='w-125' type='submit'>
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FromScratch;
