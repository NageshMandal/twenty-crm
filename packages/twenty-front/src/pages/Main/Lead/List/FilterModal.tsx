import React, { useState } from "react";
import { useForm } from "react-hook-form";

import Button from "src/components/base/Button";
import DateRangePicker from "src/components/base/DateRangePicker";
import Input from "src/components/base/Input";
import ReactSelectRh from "src/components/base/ReactSelectRh";
import SidebarModal from "src/components/base/SidebarModal";
import TextChipSet from "src/components/base/TextChip";
import configs from "src/utils/json/app-config.json";
import { ISelectOption } from "src/utils/types";
import { authSelector } from "src/store/Auth";
import { useAppSelector } from "src/hook/redux/useStore";
import { useLocation } from "src/hook/lead/useLocation";
import { useMember } from "src/hook/lead/useMember";
import { useTechnology } from "src/hook/lead/useTechnology";
import Icon from "src/components/base/Icon";

type Props = {
  open: boolean;
  onClose: Function;
  tagOptions: ISelectOption[];
  setFilter?: Function;
  handleMyContacts?: any;
  handleMyCompanies?: any;
  handleTags?: any;
  handleStages?: any;
  handleImportCSV?: any;
  handleExportHistory?: any;
};

const emailOptions = [
  { label: "Verified", value: "true" },
  { label: "Guessed", value: "false" },
  { label: "None", value: "blank" },
];

const LeadFilterModal: React.FC<Props> = ({
  open,
  onClose,
  tagOptions,
  setFilter = () => {},
  handleMyCompanies = () => {},
  handleMyContacts = () => {},
  handleTags = () => {},
  handleStages = () => {},
  handleImportCSV = () => {},
  handleExportHistory = () => {},
}) => {
  const { control, setValue, register, watch } = useForm();
  const { technologyList, categoryList } = useTechnology();
  const { memberOptions, stageOptions } = useMember();
  const { locationOption } = useLocation(null);
  const watchFields = watch();

  const { userInfo } = useAppSelector(authSelector);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [createdAt, setCreatedAt] = useState<string[]>([]);
  const [names, setNames] = useState<string[]>([]);
  const [titles, setTitles] = useState<string[]>([]);
  const [companyNames, setCompanyNames] = useState<string[]>([]);

  const handleResetFilter = () => {
    setStartDate(null);
    setEndDate(null);
    setCreatedAt([]);
    [
      "companyIndustry",
      "companySize",
      "companyTags",
      "emailStatus",
      "technology",
      "excludeTechnology",
      "technologyCategory",
      "excludeTechnologyCategory",
      "location",
      "users",
      "stages",
    ].forEach((item) => {
      setValue(item, []);
    });
    setNames([]);
    setTitles([]);
    setCompanyNames([]);
    setFilter("");
    onClose();
  };

  const handleFilter = () => {
    let nameQuery = "";
    if (!!names?.length) {
      const operator = "has";
      nameQuery = "@keywords" + ` ${operator} ` + "'" + names[0];
      for (let i = 1; i < names.length; i++) {
        nameQuery += "', '" + names[i];
      }
      nameQuery += "'";
    }

    let titleQuery = "";
    if (!!titles?.length) {
      const operator = "has";
      titleQuery = "@position" + ` ${operator} ` + "'" + titles[0];
      for (let i = 1; i < titles.length; i++) {
        titleQuery += "', '" + titles[i];
      }
      titleQuery += "'";
    }

    let createdQuery = "";
    if (!!createdAt.length) {
      createdQuery = "@created between" + ` ${createdAt}`;
    }

    let industryQuery = "";
    if (!!watchFields?.companyIndustry?.length) {
      const operator = "has";
      industryQuery = "@industry" + ` ${operator} ` + "'" + watchFields?.companyIndustry[0].value;
      for (let i = 1; i < watchFields?.companyIndustry?.length; i++) {
        industryQuery += "', '" + watchFields?.companyIndustry[i].value;
      }
      industryQuery += "'";
    }

    let companySizeQuery = "";
    if (!!watchFields?.companySize?.length) {
      const operator = "has";
      companySizeQuery =
        "@company.size" + ` ${operator} ` + "'" + watchFields?.companySize[0].value;
      for (let i = 1; i < watchFields?.companySize.length; i++) {
        companySizeQuery += "', '" + watchFields?.companySize[i].value;
      }
      companySizeQuery += "'";
    }

    let companyNameQuery = "";
    if (!!companyNames?.length) {
      const operator = "has";
      companyNameQuery = "@keywords" + ` ${operator} ` + "'" + companyNames[0];
      for (let i = 1; i < companyNames.length; i++) {
        nameQuery += "', '" + companyNames[i];
      }
      companyNameQuery += "'";
    }

    let tagsQuery = "";
    if (!!watchFields?.companyTags?.length) {
      const operator = "in";
      tagsQuery = "@tag" + ` ${operator} ` + "'" + watchFields?.companyTags[0].value;
      for (let i = 1; i < watchFields?.companyTags.length; i++) {
        tagsQuery += "', '" + watchFields?.companyTags[i].value;
      }
      tagsQuery += "'";
    }

    let emailQuery = "";
    if (!!watchFields?.emailStatus?.length) {
      emailQuery = "(";
      const blankExist = watchFields?.emailStatus?.some(
        (item: ISelectOption) => item.value === "blank"
      );
      if (blankExist) {
        watchFields?.emailStatus?.splice(0, 1);
        emailQuery += "@email is blank";
        if (watchFields?.emailStatus?.length) emailQuery += " OR ";
      }
      if (watchFields?.emailStatus?.length) {
        emailQuery += "@email.is_verified" + " has '" + watchFields?.emailStatus[0].value;

        for (let i = 1; i < watchFields?.emailStatus?.length; i++) {
          emailQuery += "', '" + watchFields?.emailStatus[i].value;
        }
        emailQuery += "'";
      }
      emailQuery += ")";
    }

    let technologiesQuery = "";
    if (!!watchFields?.technology?.length) {
      const operator = "has";
      technologiesQuery =
        "@company.tech.key" + ` ${operator} ` + "'" + watchFields?.technology[0].value;
      for (let i = 1; i < watchFields?.technology?.length; i++) {
        technologiesQuery += "', '" + watchFields?.technology[i].value;
      }
      technologiesQuery += "'";
    }

    let excludeTechnologiesQuery = "";
    if (!!watchFields?.excludeTechnology?.length) {
      const operator = "not have";
      excludeTechnologiesQuery =
        "@company.tech.key" + ` ${operator} ` + "'" + watchFields?.excludeTechnology[0].value;
      for (let i = 1; i < watchFields?.excludeTechnology.length; i++) {
        excludeTechnologiesQuery += "', '" + watchFields?.excludeTechnology[i].value;
      }
      excludeTechnologiesQuery += "'";
    }

    let technologyCategoriesQuery = "";
    if (!!watchFields?.technologyCategory?.length) {
      const operator = "has";
      technologyCategoriesQuery =
        "@company.tech.category_key" +
        ` ${operator} ` +
        "'" +
        watchFields?.technologyCategory[0].value;
      for (let i = 1; i < watchFields?.technologyCategory?.length; i++) {
        technologyCategoriesQuery += "', '" + watchFields?.technologyCategory[i].value;
      }
      technologyCategoriesQuery += "'";
    }

    let excludeTechnologyCategoriesQuery = "";
    if (!!watchFields?.excludeTechnologyCategory?.length) {
      const operator = "not have";
      excludeTechnologyCategoriesQuery =
        "@company.tech.category_key" +
        ` ${operator} ` +
        "'" +
        watchFields?.excludeTechnologyCategory[0].value;
      for (let i = 1; i < watchFields?.excludeTechnologyCategory?.length; i++) {
        excludeTechnologyCategoriesQuery +=
          "', '" + watchFields?.excludeTechnologyCategory[i].value;
      }
      excludeTechnologyCategoriesQuery += "'";
    }

    let userQuery = `@user_id in ${userInfo?.id}`;
    if (!!watchFields?.users?.length) {
      for (let i = 0; i < watchFields?.users.length; i++) {
        userQuery += ", " + watchFields?.users[i].value;
      }
    }

    let locationQuery = "";
    if (!!watchFields?.location?.length) {
      const locationArray = watchFields?.location?.map(
        (item: any) => `(${`@location.country has '${item?.value}')`}`
      );
      locationQuery = `(${locationArray?.join(" OR ")})`;
    }

    let stageQuery = "";
    if (!!watchFields?.stages?.length) {
      const operator = "in";
      stageQuery = "@stage" + ` ${operator} ` + watchFields?.stages[0].value;
      for (let i = 1; i < watchFields?.stages?.length; i++) {
        stageQuery += ", " + watchFields?.stages[i].value;
      }
    }

    const query = [
      companyNameQuery,
      companySizeQuery,
      createdQuery,
      emailQuery,
      excludeTechnologiesQuery,
      excludeTechnologyCategoriesQuery,
      industryQuery,
      locationQuery,
      nameQuery,
      stageQuery,
      tagsQuery,
      technologiesQuery,
      technologyCategoriesQuery,
      titleQuery,
      userQuery,
    ]
      .filter((item) => !!item.length)
      .join(" AND ");

    setFilter(query);
    onClose();
  };

  return (
    <SidebarModal show={open} onClose={() => onClose()}>
      <div className='px-12 py-16 mx-20 mt-10 font-normal border-b text-neutral-800 dark:text-neutral-300 text-18 border-borderColor dark:border-borderColor-dark'>
        Lead Filters
      </div>
      <div className='flex flex-col gap-20 px-20 py-20 overflow-auto scrollbar-1 h-[calc(100vh-155px)] text-neutral-800 dark:text-neutral-300'>
        <div className='flex flex-col gap-8'>
          <div
            onClick={handleMyContacts}
            className='flex items-center justify-center bg-white p-8 shadow-md rounded-md hover:bg-primary hover:text-white dark:bg-gray-900 hover:dark:bg-primary hover:dark:text-white  transition duration-300 ease-in-out transform hover:shadow-lg cursor-pointer mb-4 border border-primary'
          >
            <Icon name='UserGroup' className='w-20 h-20  mr-4' />
            My Contacts
          </div>
          <div
            onClick={handleMyCompanies}
            className='flex items-center justify-center bg-white p-8 shadow-md rounded-md hover:bg-primary hover:text-white dark:bg-gray-900 hover:dark:bg-primary hover:dark:text-white  transition duration-300 ease-in-out transform hover:shadow-lg cursor-pointer mb-4 border border-primary'
          >
            <Icon name='Industry' className='w-20 h-20 dark:text-white  mr-4' />
            My Companies
          </div>
          <div
            onClick={handleTags}
            className='flex items-center justify-center bg-white p-8 shadow-md rounded-md hover:bg-primary hover:text-white dark:bg-gray-900 hover:dark:bg-primary hover:dark:text-white  transition duration-300 ease-in-out transform hover:shadow-lg cursor-pointer mb-4 border border-primary'
          >
            <Icon name='Tags' className='w-20 h-20 dark:text-white mr-4' />
            Tags
          </div>
          <div
            onClick={handleStages}
            className='flex items-center justify-center bg-white p-8 shadow-md rounded-md hover:bg-primary hover:text-white dark:bg-gray-900 hover:dark:bg-primary hover:dark:text-white  transition duration-300 ease-in-out transform hover:shadow-lg cursor-pointer mb-4 border border-primary'
          >
            <Icon name='Circuit' className='w-20 h-20 dark:text-white mr-4' />
            Stages
          </div>
          <div
            onClick={handleImportCSV}
            className='flex items-center justify-center bg-white p-8 shadow-md rounded-md hover:bg-primary hover:text-white dark:bg-gray-900 hover:dark:bg-primary hover:dark:text-white  transition duration-300 ease-in-out transform hover:shadow-lg cursor-pointer mb-4 border border-primary'
          >
            <Icon name='Upload' className='w-20 h-20 dark:text-white mr-4' />
            Import CSV
          </div>
          <div
            onClick={handleExportHistory}
            className='flex items-center justify-center bg-white p-8 shadow-md rounded-md hover:bg-primary hover:text-white dark:bg-gray-900 hover:dark:bg-primary hover:dark:text-white  transition duration-300 ease-in-out transform hover:shadow-lg cursor-pointer mb-4 border border-primary'
          >
            <Icon name='DownLoad' className='w-20 h-20 dark:text-white mr-4' />
            Export History
          </div>
        </div>
        <div className='flex flex-col gap-8'>
          <Input
            label='Name +'
            className='!py-10'
            onKeyDown={(event: any) => {
              if (event?.key == "Enter") {
                if (event?.target?.value.length && !names.includes(event?.target?.value)) {
                  setNames((prev) => [...prev, event?.target?.value]);
                }
                setTimeout(() => setValue("name", ""), 10);
              }
            }}
            register={register("name", {
              onBlur: (event) => {
                if (event?.target?.value.length && !names.includes(event?.target?.value)) {
                  setNames((prev) => [...prev, event?.target?.value]);
                }
                setTimeout(() => setValue("name", ""), 10);
              },
            })}
          />
          <TextChipSet
            list={names}
            onDelete={(val: string) =>
              setNames((prev) => [...prev]?.filter((item) => item !== val))
            }
          />
        </div>
        <div className='flex flex-col gap-8'>
          <Input
            label='Title +'
            className='!py-10'
            onKeyDown={(event: any) => {
              if (event?.key == "Enter") {
                if (event?.target?.value.length && !titles.includes(event?.target?.value)) {
                  setTitles((prev) => [...prev, event?.target?.value]);
                }
                setTimeout(() => setValue("title", ""), 10);
              }
            }}
            register={register("title", {
              onBlur: (event) => {
                if (event?.target?.value.length && !titles.includes(event?.target?.value)) {
                  setTitles((prev) => [...prev, event?.target?.value]);
                }
                setTimeout(() => setValue("title", ""), 10);
              },
            })}
          />
          <TextChipSet
            list={titles}
            onDelete={(val: string) =>
              setTitles((prev) => [...prev]?.filter((item) => item !== val))
            }
          />
        </div>
        <div className='flex flex-col gap-8'>
          <DateRangePicker
            name='availableStartDate'
            label='Created Date'
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            setRange={(val: string) => setCreatedAt([val])}
          />
          <TextChipSet
            list={createdAt}
            onDelete={(val: string) => {
              setCreatedAt((prev) => [...prev]?.filter((item) => item !== val));
              setStartDate(null);
              setEndDate(null);
            }}
          />
        </div>
        <ReactSelectRh
          control={control}
          options={Object.keys(configs.search.industries)?.map((item) => ({
            label: item,
            value: item,
          }))}
          label='Company Industry'
          name='companyIndustry'
          isMulti
        />
        <ReactSelectRh
          options={Object.values(configs.search.companySizes)?.map((item) => ({
            label: item,
            value: item,
          }))}
          label='Company Size'
          isMulti
          name='companySize'
          control={control}
        />
        <div className='flex flex-col gap-8'>
          <Input
            label='Company Name +'
            className='!py-10'
            onKeyDown={(event: any) => {
              if (event?.key == "Enter") {
                if (event?.target?.value.length && !companyNames.includes(event?.target?.value)) {
                  setCompanyNames((prev) => [...prev, event?.target?.value]);
                }
                setTimeout(() => setValue("companyNames", ""), 10);
              }
            }}
            register={register("companyNames", {
              onBlur: (event) => {
                if (event?.target?.value.length && !companyNames.includes(event?.target?.value)) {
                  setCompanyNames((prev) => [...prev, event?.target?.value]);
                }
                setTimeout(() => setValue("companyNames", ""), 10);
              },
            })}
          />
          <TextChipSet
            list={companyNames}
            onDelete={(val: string) =>
              setCompanyNames((prev) => [...prev]?.filter((item) => item !== val))
            }
          />
        </div>
        <ReactSelectRh
          options={tagOptions}
          label='Tags'
          isMulti
          control={control}
          name='companyTags'
        />
        <ReactSelectRh
          options={emailOptions}
          label='Email Status'
          isMulti
          control={control}
          name='emailStatus'
        />
        <ReactSelectRh
          options={technologyList}
          label='Technology'
          isMulti
          control={control}
          name='technology'
        />
        <ReactSelectRh
          options={technologyList}
          label='Exclude Technology'
          isMulti
          control={control}
          name='excludeTechnology'
        />
        <ReactSelectRh
          options={categoryList}
          label='Technology Category'
          isMulti
          control={control}
          name='technologyCategory'
        />
        <ReactSelectRh
          options={categoryList}
          label='Exclude Technology Category'
          isMulti
          control={control}
          name='excludeTechnologyCategory'
        />
        <ReactSelectRh
          options={memberOptions}
          label='User'
          isMulti
          control={control}
          name='users'
        />
        <ReactSelectRh
          options={locationOption}
          label='Location'
          isMulti
          control={control}
          name='location'
        />
        <ReactSelectRh
          options={stageOptions}
          label='Stages'
          isMulti
          control={control}
          name='stages'
        />
      </div>
      <div className='flex justify-center gap-16 px-20 py-16'>
        <Button className='w-100' buttonStyle='secondary' onClick={() => handleResetFilter()}>
          Reset Filter
        </Button>
        <Button className='w-100' onClick={() => handleFilter()}>
          Filter
        </Button>
      </div>
    </SidebarModal>
  );
};

export default LeadFilterModal;
