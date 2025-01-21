import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Button from "src/components/base/Button";
import DeleteModal from "src/components/modules/DeleteModal";
import Icon from "src/components/base/Icon";
import TableEmpty from "src/components/base/TableEmpty";
import TableSkeleton from "src/components/base/TableSkeleton";
import { IWorkflow } from "src/utils/types/social-selling";
import { automationSelector, deleteAutomation, getAutomations } from "src/store/Automation";
import { paths } from "src/routes/path";
import { useAppDispatch, useAppSelector } from "src/hook/redux/useStore";

const AutomationPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedAutomationId, setSelectedAutomationId] = useState<number>();
  // console.log("selctedauto " + selectedAutomationId);

  const { isAutomationPending, automations, isDeleteAutomationPending } =
    useAppSelector(automationSelector);

  const fetchAutomationData = async () => {
    await dispatch(getAutomations());
  };

  const handleDeleteAutomaton = async () => {
    if (selectedAutomationId) {
      const res = await dispatch(deleteAutomation(selectedAutomationId));
      if (deleteAutomation.fulfilled.match(res)) {
        toast.success("Automation successfully deleted!");
        setSelectedAutomationId(null);
      }
    }
    setShowModal(false);
  };

  const handleNavigate = (workflowId: number) => {
    navigate(paths.main.automation.create, { state: { workflowId, builder: true } });
  };

  const tabs = [
    { name: "Active Automation", href: "#", value: 0 },
    { name: "Not active Automation", href: "#", value: 1 },
  ];

  const tableColumn = [
    {
      id: "name",
      label: "AUTOMATION NAME",
      width: "w-300",
    },
    {
      id: "step_count",
      label: "STEPS",
      width: "w-150",
    },
    {
      id: "created_at",
      label: "CREATED BY",
      width: "w-250",
    },
    {
      id: "updated_at",
      label: "LAST RUN",
      width: "w-250",
    },
    {
      id: "action",
      label: "Actions",
      width: "w-100",
      render: (row: IWorkflow) => (
        <div className='flex items-center gap-30 text-primary'>
          <p
            className='cursor-pointer group-hover:text-white whitespace-nowrap'
            onClick={() => handleNavigate(row?.id)}
          >
            Open Automation
          </p>
          <Icon
            onClick={() => {
              setShowModal(true);
              setSelectedAutomationId(row.id);
            }}
            name='Cross'
            className='w-20 h-20 text-neutral-800 dark:text-neutral-300 group-hover:text-white'
          ></Icon>
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchAutomationData();
  }, []);

  const filteredAutomation = useMemo(() => {
    if (activeTab === 0) {
      const result = automations?.filter(
        (item) => item.status === "running" || item.status === "processing"
      );
      return result;
    } else {
      const result = automations?.filter(
        (item) => item.status !== "running" && item.status !== "processing"
      );
      return result;
    }
  }, [activeTab, automations]);

  useEffect(() => {
    // Reset selectedAutomationId when the page becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        setSelectedAutomationId(null);
      }
    };
    setSelectedAutomationId(null);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <>
      <div>
        <div className='flex items-center justify-between'>
          <div className='flex items-center justify-start gap-20'>
            <h2 className='font-normal select-none text-25 text-neutral-800 dark:text-neutral-300'>
              Automations
            </h2>
          </div>
        </div>
        <div className='flex items-center justify-between'>
          <div className='hidden sm:block'>
            <div className='pt-20 border-b border-borderColor dark:border-borderColor-dark'>
              <nav className='flex -mb-px text-30'>
                {tabs.map((tab) => (
                  <div
                    key={tab.name}
                    className={`whitespace-nowrap border-b-2 py-4 pr-16 pl-2 text-sm font-normal cursor-pointer flex justify-start ${
                      tab?.value === activeTab
                        ? "border-primary text-primary "
                        : "border-transparent text-neutral-600 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-neutral-600 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab(tab.value)}
                  >
                    <p className='text-18'>{tab.name}</p>
                  </div>
                ))}
              </nav>
            </div>
          </div>
          <Button
            prefix='EditPen'
            onClick={() => {
              setSelectedAutomationId(null);
              navigate(paths.main.automation.create);
            }}
          >
            Create Automation
          </Button>
        </div>
        <div>
          <div className='mb-20 mt-35 max-h-[calc(100vh-235px)] scrollbar-thin overflow-auto dark:scrollbar-thumb-neutral-700 scrollbar-thumb-neutral-300 border border-borderColor dark:border-borderColor-dark'>
            <table className='relative z-10 w-full shadow-md bg-contentColor dark:bg-contentColor-dark text-neutral-800 dark:text-neutral-300 '>
              <thead className='sticky top-0 z-20 w-full dark:text-neutral-300'>
                <tr className='z-50 bg-contentColor dark:bg-contentColor-dark'>
                  {tableColumn.map((item) => (
                    <td
                      key={item.id}
                      className={`px-20 font-medium text-left py-14 text-14 ${item.width}`}
                    >
                      {item.label}
                    </td>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isAutomationPending && !automations.length ? (
                  <TableSkeleton rowCount={14} cellCount={5} />
                ) : automations?.length ? (
                  filteredAutomation?.map((automation: any, socialIndex: number) => (
                    <tr
                      key={socialIndex}
                      className='transition-all duration-100 hover:bg-primary-2 dark:hover:bg-primary-5 group'
                    >
                      {tableColumn.map((item) => (
                        <td
                          key={item?.id}
                          className='px-20 font-normal group-hover:text-white py-14 text-13'
                        >
                          {item.render ? item.render(automation) : automation[item.id]}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : null}
              </tbody>
              {!automations?.length && !isAutomationPending && <TableEmpty />}
            </table>
          </div>
        </div>
      </div>
      <DeleteModal
        isPending={isDeleteAutomationPending}
        open={showModal}
        onClose={() => setShowModal(false)}
        title='Do you want to delete this Automation?'
        handleDelete={() => handleDeleteAutomaton()}
      />
    </>
  );
};

export default AutomationPage;
