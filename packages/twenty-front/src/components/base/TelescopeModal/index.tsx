import React, { useState, Fragment, ReactNode, useRef } from "react";
import classNames from "classnames";
import { Transition } from "@headlessui/react";

import Icon from "../Icon";
import useOutsideClick from "../../../hook/common/useOutsideClick";
import axios from "src/utils/functions/axios";
import { toast } from "react-toastify";
import Button from "../Button";

type ModalProps = {
  children: ReactNode;
  show: boolean;
  onClose?: Function;
  disabled?: boolean;
  className?: string;
  hideClose?: boolean;
  telescopeData?: any;
  workflowName?: string;
};

type Tab = "Prospects" | "Logs" | "Settings";

const TelescopeModal: React.FC<ModalProps> = ({
  children,
  show = false,
  onClose = () => {},
  disabled = false,
  className = "",
  hideClose = false,
  telescopeData,
  workflowName,
}) => {
  const ref = useRef<HTMLInputElement | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("Prospects");
  const [isDeleting, setIsDeleting] = useState(false);

  useOutsideClick(ref, () => {
    if (!disabled) onClose();
  });

  const handleTabSwitch = (tab: Tab) => {
    setActiveTab(tab);
  };

  // Function to handle deletion
  const handleDelete = async (workflowId, prospectId) => {
    setIsDeleting(true);
    try {
      const response = await axios(true).post(
        `${process.env.REACT_APP_WORKFLOW_API_URL}/workflow/${workflowId}/prospect/${prospectId}/delete`
      );
      if ((response as any).status == "success") {
        toast.success("Prospect deleted successfully");
        // Optionally, refresh the data or update the state to remove the deleted prospect
      } else {
        toast.error("Failed to delete prospect");
      }
    } catch (error) {
      toast.error("Error deleting prospect");
      console.error(error);
    }
    setIsDeleting(false);
    onClose();
  };

  const renderContent = () => {
    if (activeTab === "Prospects") {
      // Render Prospects content here
      return (
        <div className='dark:text-neutral-300 space-y-4'>
          {telescopeData &&
            telescopeData.prospects?.map((prospectData, index) => {
              const singleProspect = JSON.parse(prospectData.prospect.single_prospect);
              const hasDuplicates = prospectData.duplicates.length > 0;
              return (
                <div
                  key={index}
                  className={`p-20 m-20 rounded-lg shadow-md ${
                    hasDuplicates ? "border border-red-300" : "border border-gray-300"
                  }`}
                >
                  <h3 className='text-lg font-bold mb-2'>Prospect Information</h3>
                  <p>
                    <strong>Name:</strong> {singleProspect.name}
                  </p>
                  {prospectData.prospect.company_name && (
                    <p>
                      <strong>Company:</strong> {prospectData.prospect.company_name}
                    </p>
                  )}
                  {singleProspect.email && (
                    <p>
                      <strong>Email:</strong> {singleProspect.email}
                    </p>
                  )}
                  {hasDuplicates && (
                    <>
                      <h4 className='text-md font-semibold mt-4 mb-2'>Duplicates</h4>
                      <ul className='list-disc list-inside'>
                        {prospectData.duplicates.map((duplicate, dupIndex) => (
                          <li key={dupIndex}>
                            <strong>Workflow Name:</strong> {duplicate.workflow_name}
                          </li>
                        ))}
                      </ul>
                      <Button
                        className='mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700'
                        buttonStyle='error'
                        isPending={isDeleting}
                        onClick={() =>
                          handleDelete(
                            prospectData.prospect.workflow_id,
                            prospectData.prospect.prospect_id
                          )
                        }
                      >
                        DELETE PROSPECT IN THIS WORKFLOW
                      </Button>
                    </>
                  )}
                </div>
              );
            })}
        </div>
      );
    } else if (activeTab === "Logs") {
      // Render Logs content here
      return (
        <div className='dark:text-neutral-300'>
          <h3 className='text-lg font-bold mb-2'>Workflow Logs</h3>
          <ul className='list-disc list-inside'>
            {telescopeData &&
              telescopeData.logs.split(", ").map((log, index) => <li key={index}>{log}</li>)}
          </ul>
        </div>
      );
    } else if (activeTab === "Settings") {
      // Render settings content here
      return (
        <div className='dark:text-neutral-300'>
          <h3 className='text-lg font-bold mb-2'>Workflow Settings</h3>
          <ul className='list-disc list-inside'>
            {telescopeData &&
              telescopeData.settings
                .split(", ")
                .map((setting, index) => <li key={index}>{setting}</li>)}
          </ul>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <Transition appear show={show} as={Fragment}>
        <div className='relative z-50 dark:scrollbar-thumb-neutral-700 scrollbar-thumb-neutral-300 scrollbar-thin'>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 overflow-hidden bg-black bg-opacity-25' />
          </Transition.Child>
          <div className='fixed inset-0 z-50 flex items-end justify-center py-20 overflow-hidden tablet:items-center'>
            <Transition.Child
              as={Fragment}
              enter={"ease-out duration-300"}
              enterFrom={"tablet:opacity-0 tablet:scale-95 translate-y-full tablet:translate-y-0"}
              enterTo={"opacity-100 scale-100 translate-y-0"}
              leave={"ease-in duration-200"}
              leaveFrom={"opacity-100 scale-100 translate-y-0"}
              leaveTo={"tablet:opacity-0 tablet:scale-95 translate-y-full tablet:translate-y-0"}
            >
              <div
                className='relative w-screen max-h-full h-full pt-10 border bg-modalContentColor dark:bg-contentColor-dark dark:border-borderColor-dark rounded-t-2xl tablet:rounded-b-2xl tablet:w-auto scrollbar-thin dark:scrollbar-thumb-neutral-700 scrollbar-thumb-neutral-300 scrollbar-track-rounded-full'
                ref={ref}
                style={{ overflow: "auto" }}
              >
                {!hideClose && (
                  <div
                    className={"w-24 h-24 absolute top-20 right-20"}
                    onClick={() => {
                      if (!disabled) onClose();
                    }}
                    role='button'
                  >
                    <Icon name='Cross' className='dark:text-neutral-200 text-neutral-800' />
                  </div>
                )}
                {/* <div className={classNames("h-full tablet:p-20 p-15", className)}>{children}</div> */}
                <div className='flex space-x-4 border-b border-gray-300 dark:border-gray-700 mt-50 dark:text-neutral-300 p-16'>
                  {" "}
                  {/* Flex container for tabs */}
                  <div
                    className={classNames(
                      "cursor-pointer px-10 py-2",
                      {
                        "border-b-2 border-blue-500 font-bold dark:border-blue-300":
                          activeTab === "Prospects",
                      },
                      { "hover:text-blue-500 dark:hover:text-blue-300": activeTab !== "Prospects" }
                    )}
                    onClick={() => handleTabSwitch("Prospects")}
                  >
                    Prospects
                  </div>
                  <div
                    className={classNames(
                      "cursor-pointer px-10 py-2",
                      {
                        "border-b-2 border-blue-500 font-bold dark:border-blue-300":
                          activeTab === "Logs",
                      },
                      { "hover:text-blue-500 dark:hover:text-blue-300": activeTab !== "Logs" }
                    )}
                    onClick={() => handleTabSwitch("Logs")}
                  >
                    Logs
                  </div>
                  <div
                    className={classNames(
                      "cursor-pointer px-10 py-2",
                      {
                        "border-b-2 border-blue-500 font-bold dark:border-blue-300":
                          activeTab === "Settings",
                      },
                      { "hover:text-blue-500 dark:hover:text-blue-300": activeTab !== "Settings" }
                    )}
                    onClick={() => handleTabSwitch("Settings")}
                  >
                    Settings
                  </div>
                </div>
                <div className={classNames("h-full tablet:p-20 p-15", className)}>
                  <div className='text-lg font-bold mb-2 dark:text-neutral-200'>
                    Workflow: {workflowName}
                  </div>
                  {renderContent()}
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Transition>
    </>
  );
};

export default TelescopeModal;
