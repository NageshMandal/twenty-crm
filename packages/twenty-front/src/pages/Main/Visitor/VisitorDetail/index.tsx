import React, { Fragment, ReactNode, useEffect, useMemo, useState } from "react";
import { IPeopleVisitor, IProspect, IReqVisitor, IResAddAutomation } from "src/utils/types/visitor";
import { ImEye } from "react-icons/im";
import { format } from "date-fns";
import Session from "./Session";

import { IoMdPerson } from "react-icons/io";
import { MdGroups, MdOutlineLocationOn } from "react-icons/md";
import { LiaIndustrySolid } from "react-icons/lia";
import { FaRegBuilding, FaRegEdit } from "react-icons/fa";
import { PiBooksLight } from "react-icons/pi";
import { BsBuildings } from "react-icons/bs";
import { Menu, Transition } from "@headlessui/react";
import Button from "src/components/base/Button";
import VisitorFilterModal from "../CompanyDetail/FilterModal";
import AutomationModal from "../module/AutomationModal";

import { getAutomations, visitorSelector } from "src/store/Vistor";
import { useAppDispatch, useAppSelector } from "src/hook/redux/useStore";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "react-toastify";
import { visitorApi } from "src/api/visitor";
import axios from "src/utils/functions/axios";

type Props = {
  visitor: IPeopleVisitor;
  selectedProspects: IPeopleVisitor[];
  userId?: number;
  hash?: any;
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

const VisitorDetail: React.FC<Props> = ({ visitor, selectedProspects, userId, hash }) => {
  const dispatch = useAppDispatch();
  const [showAllActivity, setShowAllActivity] = useState(false);

  const [showFilterModal, setShowFilerModal] = useState(false);
  const [selectedFilterTarget, setSelectedFilterTarget] = useState("");
  const [selectedVisitorId, setSelectedVisitorId] = useState<string[]>([]);
  const [isPending, setIsPending] = useState(false);

  const sessions = useMemo(() => {
    if (visitor) {
      setSelectedVisitorId([visitor.id]);
      const result = visitor.sessions.sort((a, b) => {
        const targetA = new Date(a.created_at);
        const targetB = new Date(b.created_at);
        return targetB.getTime() - targetA.getTime();
      });
      return result;
    }
  }, [visitor]);

  const [showAutomationModal, setShowAutomationModal] = useState(false);
  const { automations } = useAppSelector(visitorSelector);
  const { control } = useForm();
  useForm();
  const selectedAutomations = useWatch({ control, name: "automations" });
  const [isAddAutomationLoading, setIsAddAutomationLoading] = useState(false);

  const handleVisitorAsLead = async () => {
    if (isPending) {
      return false;
    } else {
      setIsPending(true);
      try {
        const visitorId = visitor.id; // Replace this with your dynamic visitor.id

        const filterData = {
          filter: {
            ids: Array.isArray(visitorId) ? visitorId : [visitorId],
            query: "",
          },
        };
        await axios(true).post(
          `${process.env.REACT_APP_DEMAND_API_URL}/acquire/${hash}/inbound-people`,
          JSON.stringify(filterData),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("Save as Lead successfully!");
        setIsPending(false);
        return true;
      } catch (error) {
        toast.error("Failed to save workflow. Please try again.");
        console.error("Failed to save as lead." + error);
        setIsPending(false);
        return false;
      }
    }
  };

  const handleAutomations = async () => {
    if (handleVisitorAsLead()) {
      try {
        const reqByTrackingId: any = {
          q: visitor.data_tracking_id,
          types: ["prospect"],
        };
        const resByTrackingId = await visitorApi.handleCustomSearchByTrackingId(reqByTrackingId);
        // console.log("resources by tracking id: ", (resByTrackingId as any)[0].id);
        setIsAddAutomationLoading(true);
        try {
          if (JSON.stringify(selectedAutomations)?.length) {
            const req: IReqVisitor = {
              all: false,
              ids: [(resByTrackingId as any)[0].id],
              query: `@user_id in ${userId}`,
              wid: selectedAutomations.id,
            };
            const res = (await visitorApi.addAutomation(req)) as unknown as IResAddAutomation;
            if (res?.added === 0) {
              toast.error(`Prospect can't be added more than once `);
            } else if (res?.added && res?.added !== 0) {
              toast.success(`${res?.added} contacts successfully added`);
            }
            // console.log("req: ", req);
          } else {
            toast.warn("Automation is required filed!");
          }
        } catch (error) {
          console.error("error: ", error);
        }
      } catch (error) {
        console.error("error: ", error);
      }

      // return true;
    } else {
      toast.error(`couldnt save as lead `);
      return false;
    }
    // setIsAddAutomationLoading(true);
    // try {
    //   if (JSON.stringify(selectedAutomations)?.length) {
    //     const req: IReqVisitor = {
    //       all: false,
    //       ids: selectedVisitorId,
    //       query: `@user_id in ${userId}`,
    //       wid: selectedAutomations.id,
    //     };
    //     const res = (await visitorApi.addAutomation(req)) as unknown as IResAddAutomation;
    //     if (res?.added === 0) {
    //       toast.error(`Prospect can't be added more than once `);
    //     } else if (res?.added && res?.added !== 0) {
    //       toast.success(`${res?.added} contacts successfully added`);
    //     }
    //   } else {
    //     toast.warn("Automation is required filed!");
    //   }
    // } catch (error) {
    //   console.error("error: ", error);
    // }
    setIsAddAutomationLoading(false);
    setShowAutomationModal(false);
  };

  const handleGetAutomations = async () => {
    dispatch(getAutomations());
  };

  useEffect(() => {
    handleGetAutomations();
  }, []);

  return (
    <>
      <div className='px-32 pt-32 w-1000'>
        <h2 className='pt-10 pb-20 mr-8 font-medium border-b-2 select-none text-20 text-neutral-900 dark:text-neutral-300 border-borderColor dark:border-borderColor-dark'>
          {visitor?.name ?? "Detail"}
          <div className='pt-4'>
            <AutomationModal
              automations={automations}
              handleAutomations={() => handleAutomations()}
              open={showAutomationModal}
              control={control}
              onClose={() => setShowAutomationModal(false)}
              selectedProspects={selectedProspects as unknown as IProspect[]}
              isAddAutomationLoading={isAddAutomationLoading}
            />
          </div>
          <div className='flex gap-4'>
            <Button
              rounded
              buttonStyle='secondary'
              prefix='Plus'
              isPending={isPending}
              onClick={() => {
                handleVisitorAsLead();
                // if (selectedProspects.length) {
                //   setShowAutomationModal(true);
                //   reset();
                // } else {
                //   toast.warn("Please select Prospects");
                // }
              }}
            >
              {/* Add to Automation */}
              Add to Lead
            </Button>
            <Button
              className='ml-10'
              rounded
              buttonStyle='secondary'
              prefix='Plus'
              isPending={isPending}
              onClick={() => {
                // handleVisitorAsLead();
                if (selectedProspects.length) {
                  setShowAutomationModal(true);
                  // reset();
                } else {
                  toast.warn("Please select Prospects");
                }
              }}
            >
              Add to Automation
            </Button>
          </div>
        </h2>
        <div className='flex pb-12 pr-6 pt-2 flex-col h-[calc(100vh-245px)] overflow-auto scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-600'>
          <div className='flex items-center justify-between gap-20 px-6 pt-20'>
            <div className='flex items-center gap-20'>
              <div className='flex items-center gap-10'>
                <div className='flex items-center justify-center p-8 border-2 rounded-md border-warning-1 dark:border-warning-2 w-fit'>
                  <ImEye className='flex-none w-20 h-20 text-warning-1 dark:text-warning-2' />
                </div>
                <h2 className='font-medium title-1 text-16'>{`${
                  visitor?.sessions?.length ?? 0
                } Visits`}</h2>
              </div>
              <div className='flex items-center gap-10'>
                <div className='flex items-center justify-center p-8 border-2 rounded-md border-neutral-400 dark:border-neutral-400 w-fit'>
                  <ImEye className='flex-none w-20 h-20 text-neutral-500 dark:text-neutral-400' />
                </div>
                <div className='flex flex-col'>
                  <h2 className='font-medium title-1 text-15'>First Visit:</h2>
                  <h2 className='title-1 text-12'>
                    {format(new Date(visitor?.sessions[0]?.created_at), "dd MMM yyyy - HH:mm")}
                  </h2>
                </div>
              </div>
            </div>
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
          <div className='flex items-center gap-10 pt-16 pb-10'>
            <h2 className='pl-4 font-medium title-1 text-16'>Activities</h2>
            <h3
              className='font-normal cursor-pointer text-primary text-14 hover:underline'
              onClick={() => setShowAllActivity((prev) => !prev)}
            >
              {showAllActivity ? "Hide activities" : "View All Recent activities"}
            </h3>
          </div>
          <div className='flex flex-col gap-20'>
            {sessions?.map((session, index) => {
              const condition = !showAllActivity ? index <= 2 : true;
              return condition && <Session session={session} name={visitor.name} index={index} />;
            })}
          </div>
        </div>
        <div className='mr-10 border-t-2 border-borderColor dark:border-borderColor-dark' />
      </div>
      <VisitorFilterModal
        target={selectedFilterTarget}
        variant='visitors'
        onClose={() => setShowFilerModal(false)}
        open={showFilterModal}
      />
    </>
  );
};

export default VisitorDetail;
