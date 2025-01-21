import React, { Fragment, ReactNode, useEffect, useMemo, useState } from "react";
import ReactLoading from "react-loading";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { FaUserTie } from "react-icons/fa";
import { HiMiniUserCircle } from "react-icons/hi2";
import { ImEye } from "react-icons/im";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { Menu, Transition } from "@headlessui/react";

import Button from "src/components/base/Button";
import Tooltip from "src/components/base/Tooltip";
import Visitor from "./Visitor";
import VisitorCSVModal from "../VisitorCSVModal";
import { ICompanyProspect, ICompanyVisitor, IVisitor } from "src/utils/types/visitor";
import { IExportCSV, ITemplate } from "src/utils/types/leads";
import { OBJECT_TYPES } from "src/utils/constants/lead";
import { authSelector } from "src/store/Auth";
import { leadApi } from "src/api/leads";
import { useAppSelector } from "src/hook/redux/useStore";
import { useForm } from "react-hook-form";
import { useVisitorExportCSV } from "src/hook/visitor/useExport";
import { visitorApi } from "src/api/visitor";

import { IoMdPerson } from "react-icons/io";
import { MdGroups, MdOutlineLocationOn } from "react-icons/md";
import { LiaIndustrySolid } from "react-icons/lia";
import { FaRegBuilding, FaRegEdit } from "react-icons/fa";
import { PiBooksLight } from "react-icons/pi";
import { BsBuildings } from "react-icons/bs";
import VisitorFilterModal from "./FilterModal";

type Props = {
  company: ICompanyVisitor;
};

const FilterList: {
  label: string;
  value: string;
  icon: ReactNode;
}[] = [
  { label: "Name", value: "keywords", icon: <IoMdPerson className='w-20 h-20' /> },
  { label: "Company Size", value: "employees_range", icon: <MdGroups className='w-20 h-20' /> },
  {
    label: "Location",
    value: "location",
    icon: <MdOutlineLocationOn className='w-20 h-20' />,
  },
  { label: "Industry", value: "industry", icon: <LiaIndustrySolid className='w-20 h-20' /> },
  { label: "Department", value: "departments", icon: <FaRegBuilding className='w-20 h-20' /> },
  {
    label: "Seniority Level",
    value: "seniority_level",
    icon: <PiBooksLight className='w-20 h-20' />,
  },
  { label: "Title", value: "position", icon: <FaRegEdit className='w-20 h-20' /> },
  { label: "Company Name", value: "", icon: <BsBuildings className='w-20 h-20' /> },
];

const CompanyDetail: React.FC<Props> = ({ company }) => {
  const { exportFields, templates, setTemplates } = useVisitorExportCSV();
  const { userInfo } = useAppSelector(authSelector);

  const [screen, setScreen] = useState<number>(0);
  const [visitors, setVisitors] = useState<IVisitor[]>([]);
  const [prospects, setProspects] = useState<ICompanyProspect[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState({
    id: "",
    loading: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCSVLoading, setIsCSVLoading] = useState(false);
  const [isSaveTempLoading, setIsSaveTempLoading] = useState(false);

  const { control, register, watch, setValue } = useForm();
  const watchFields = watch();

  const [showFilterModal, setShowFilerModal] = useState(false);
  const [selectedFilterTarget, setSelectedFilterTarget] = useState("");

  const handleGetProspects = async () => {
    setIsLoading(true);
    try {
      const res = await visitorApi.getCompanyProspects(company.id, {});
      const result = res?.data as ICompanyProspect[];
      setProspects(result);
    } catch (error) {
      console.error("error: ", error);
    }
    setIsLoading(false);
  };

  const handleSaveProspect = async (prospect: ICompanyProspect) => {
    setIsSaveLoading({
      id: prospect.id,
      loading: true,
    });
    try {
      await visitorApi.handleSaveProspect(prospect);
      toast.success("Contact successfully saved!");
      const updatedProspect = prospects?.map((item) => {
        if (item.id === prospect.id) {
          return { ...item, is_duplicate: true };
        } else return { ...item };
      });
      setProspects(updatedProspect);
    } catch (error) {
      console.error("error: ", error);
      toast.error(error?.response?.data?.message ?? error?.message);
    }
    setIsSaveLoading({
      id: "",
      loading: false,
    });
  };

  const selectedFields = useMemo(() => {
    const result: string[] = [];
    Object.entries(watchFields)?.forEach(([key, value]) => {
      if (value === true) {
        result.push(key);
      }
    });
    return result;
  }, [watchFields]);

  const handleExportCSV = async () => {
    setIsCSVLoading(true);
    try {
      const req: IExportCSV = {
        columns: selectedFields,
        file_type: 1,
        optional_name: watchFields?.optionalName ?? "",
        object_type: OBJECT_TYPES.inbounds,
        filter: {
          all: false,
          ids: [company.id ?? ""],
          query: `@user_id in ${userInfo.id}`,
        },
      };
      await leadApi.exportCSV(req);
      toast.success("Exported successfully!");
    } catch (error) {
      console.error("error: ", error);
    }
    setIsCSVLoading(false);
    setIsModalOpen(false);
  };

  const handleSaveTemplate = async () => {
    setIsSaveTempLoading(true);
    try {
      const req: Partial<ITemplate> = {
        title: watchFields?.templateName,
        columns: selectedFields,
        file_type: 1,
        object_type: OBJECT_TYPES.inbounds,
        sort: "recent",
      };
      const res = (await leadApi.saveTemplate(req)) as unknown as ITemplate;
      const newTemp = { ...res, name: res?.title };
      setTemplates((prev) => [...prev, newTemp]);
      setValue("templateName", "");
      toast.success("Template successfully saved!");
      setValue("template", newTemp);
    } catch (error) {
      console.error("error: ", error);
    }
    setIsSaveTempLoading(false);
  };

  useEffect(() => {
    if (company) {
      const result = company.visitors.sort((a, b) => {
        const targetA = new Date(a.sessions[a.sessions.length - 1].created_at);
        const targetB = new Date(b.sessions[b.sessions.length - 1].created_at);
        return targetB.getTime() - targetA.getTime();
      });

      setVisitors(result ?? []);
    }
    handleGetProspects();
    setScreen(0);
    return () => setVisitors([]);
  }, [company]);

  return (
    <>
      <div className='px-32 pt-32 w-1000'>
        <div className='flex items-center justify-between pt-10 pb-20 mr-8 border-b-2 border-borderColor dark:border-borderColor-dark'>
          <h2 className='font-medium select-none text-20 text-neutral-900 dark:text-neutral-300'>
            {company?.company?.name ?? "Detail"}
          </h2>
        </div>
        {screen === 1 ? (
          <>
            <div>A</div>
          </>
        ) : (
          <>
            <div className='flex pr-4 pt-2 flex-col h-[calc(100vh-245px)] overflow-auto scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-600'>
              <div className='flex items-center justify-between gap-20 px-6 pt-20'>
                <div className='flex items-center gap-16'>
                  <div className='flex items-center gap-10'>
                    <div className='flex items-center justify-center p-8 border-2 rounded-md border-warning-1 dark:border-warning-2 w-fit'>
                      <ImEye className='flex-none w-20 h-20 text-warning-1 dark:text-warning-2' />
                    </div>
                    <h2 className='font-medium title-1 text-16'>{`${
                      visitors.length ?? 0
                    } Visits`}</h2>
                  </div>
                  <div className='flex items-center gap-10'>
                    <div className='flex items-center justify-center p-8 border-2 rounded-md border-neutral-400 dark:border-neutral-400 w-fit'>
                      <ImEye className='flex-none w-20 h-20 text-neutral-500 dark:text-neutral-400' />
                    </div>

                    <div className='flex flex-col'>
                      <h2 className='font-medium title-1 text-15'>First Visit:</h2>
                      <h2 className='title-1 text-12'>
                        {format(new Date(company.first_visit), "dd MMM yyyy - HH:mm")}
                      </h2>
                    </div>
                  </div>
                </div>
                <div className='flex gap-10'>
                  <Button
                    prefix='Upload'
                    className='!py-8 w-110'
                    onClick={() => setIsModalOpen(true)}
                  >
                    Export
                  </Button>
                  <Menu as='div' className='relative inline-block text-left'>
                    <div>
                      <Menu.Button>
                        <Button prefix='FilterBar' className='!py-8 w-110'>
                          Filter
                        </Button>
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter='transition ease-out duration-100'
                      enterFrom='transform opacity-0 scale-95'
                      enterTo='transform opacity-100 scale-100'
                      leave='transition ease-in duration-75'
                      leaveFrom='transform opacity-100 scale-100'
                      leaveTo='transform opacity-0 scale-95'
                    >
                      <Menu.Items className='absolute right-0 z-50 p-2 border rounded-md shadow-xl select-none top-44 bg-contentColor dark:bg-contentColor-dark border-borderColor dark:border-borderColor-dark min-w-150'>
                        <div className='px-1 py-1'>
                          {FilterList.map((item) => (
                            <Menu.Item key={item.label}>
                              <button
                                onClick={() => {
                                  setShowFilerModal(true);
                                  setSelectedFilterTarget(item.value);
                                }}
                                className={`flex items-center justify-start w-full px-10 py-6 rounded-md cursor-pointer text-14 whitespace-nowrap hover:bg-hoverColor hover:dark:bg-hoverColor-dark title-2 hover:title-1 gap-10`}
                              >
                                {item.icon}
                                <p className='pr-4'>{item.label}</p>
                              </button>
                            </Menu.Item>
                          ))}
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
              <h2 className='pt-16 pb-10 pl-4 font-medium title-1 text-16'>Activities</h2>
              <div className='flex flex-col gap-20'>
                {visitors?.map((visitor, index) => (
                  <Visitor visitor={visitor} index={index} />
                ))}
              </div>
              {isLoading ? (
                <div className='flex justify-center w-full py-10'>
                  <ReactLoading className='mt-25' type={"spin"} color='#2285E1' width={40} />
                </div>
              ) : (
                <>
                  <div className='flex items-center justify-between gap-20 px-6 pt-20 pb-16'>
                    <div className='flex items-center gap-10 pt-10'>
                      <div className='flex items-center justify-center p-8 border-2 rounded-md border-primary dark:border-primary w-fit'>
                        <FaUserTie className='flex-none w-20 h-20 text-primary' />
                      </div>
                      <h2 className='font-semibold title-1 text-15'>{`${
                        prospects?.length ?? 0
                      } Contacts in Demand`}</h2>
                    </div>
                  </div>
                  {prospects ? (
                    <>
                      <div className='mr-8 font-medium select-none border-borderColor dark:border-borderColor-dark'>
                        {prospects?.map((prospect) => (
                          <div
                            key={prospect.id}
                            className='flex items-center px-8 border-b py-18 border-borderColor dark:border-borderColor-dark'
                          >
                            <div className='flex items-center gap-10 min-w-500'>
                              <HiMiniUserCircle className='flex-none w-28 h-28 text-neutral-400' />
                              <p className='title-1'>{`${prospect.first_name} ${prospect.last_name}`}</p>
                            </div>
                            {prospect.is_duplicate ? (
                              <BsFillCheckCircleFill className='flex-none w-22 h-22 text-success-1' />
                            ) : isSaveLoading.loading ? (
                              <BsFillPlusCircleFill
                                className={`flex-none w-22 h-22 text-success-1 ${
                                  isSaveLoading.loading && prospect.id === isSaveLoading.id
                                    ? "animate-spin !text-primary"
                                    : ""
                                }`}
                              />
                            ) : (
                              <Tooltip label='Save contact' className='top-0 pt-0 mt-0'>
                                <BsFillPlusCircleFill
                                  className='flex-none transition-all duration-150 cursor-pointer w-22 h-22 text-success-1 hover:text-success'
                                  onClick={() => handleSaveProspect(prospect)}
                                />
                              </Tooltip>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  ) : null}
                </>
              )}
            </div>
            <div className='border-t-2 border-borderColor dark:border-borderColor-dark' />
          </>
        )}
      </div>
      <VisitorCSVModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        control={control}
        register={register}
        exportFields={exportFields}
        handleExportCSV={() => handleExportCSV()}
        handleSaveTemplate={() => handleSaveTemplate()}
        isCSVLoading={isCSVLoading}
        isSaveLoading={isSaveTempLoading}
        selectedFields={selectedFields}
        templates={templates}
        watchFields={watchFields}
      />
      <VisitorFilterModal
        target={selectedFilterTarget}
        variant='visitors'
        onClose={() => setShowFilerModal(false)}
        open={showFilterModal}
      />
    </>
  );
};

export default CompanyDetail;
