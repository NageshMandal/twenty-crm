import React, { useState } from "react";
import Icon from "src/components/base/Icon";
import axios from "src/utils/functions/axios";
import { Providers } from "./Providers";
import { Switch } from "@headlessui/react";
import { toast } from "react-toastify";
import ReactLoading from "react-loading";
import ErrorsModal from "./ErrorsModal";
import UpdateMailBoxModal from "./UpdateMailBoxModal";
import DeleteModal from "src/components/modules/DeleteModal";

type MailBoxRowProps = {
  mailbox: any;
  handleDeleteMail: Function;
  setMailboxesFetchAgain: Function;
};

const mailboxStatus = {
  0: "disabled",
  1: "Working",
  2: "error",
};

const MailBoxRow: React.FC<MailBoxRowProps> = ({
  mailbox,
  handleDeleteMail,
  setMailboxesFetchAgain,
}) => {
  const [isMailEnabled, setIsMailEnabled] = useState(
    mailbox.send_status == 1 && mailbox.sync_status == 1
  );
  const [isRotatingEnabled, setIsRotatingEnabled] = useState(
    mailbox.is_rotating != null && mailbox.is_rotating == 1
  );
  const [isPending, setIsPending] = useState(false);
  const [showErrorLogs, setShowErrorLogs] = useState(false);
  const [showUpdateMail, setShowUpdateMail] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isMailboxDefault, setIsMailboxDefault] = useState(mailbox.is_default);

  async function onChangeMailStatus(val: any) {
    setIsPending(true);
    await axios(true)
      .put(`${process.env.REACT_APP_PLAYBOOK_API_URL}/mailboxes/${mailbox.id}/toggle-active`)
      .then((response) => {
        // Check if the response status is successful (e.g., HTTP status 2xx).
        // if (response.status >= 200 && response.status < 300) {
        //   toast.success("Successfull!");
        //   setIsMailEnabled(!isMailEnabled);
        // } else {
        //   // Handle any other unexpected response status codes as errors.
        //   toast.error("Error Occurred! on response" + response);
        // }
        if (response) {
          toast.success("Successfully updated!");
          setIsMailEnabled(
            (response as any).send_status == 1 && (response as any).sync_status == 1
          );
          mailbox = response as any;
        } else {
          // Handle any other unexpected response status codes as errors.
          toast.error("Error Occurred! on response" + response);
        }
      })
      .catch((error) => {
        // Handle network errors, timeouts, or other issues.
        console.error("Network Error:", error);
        toast.error(error?.response.data.error + " " + error.response.data.message);
      });
    setIsPending(false);
  }

  async function onChangeMailDefault(val: any) {
    setIsPending(true);
    await axios(true)
      .put(`${process.env.REACT_APP_PLAYBOOK_API_URL}/mailboxes/${mailbox.id}/set-default`)
      .then((response) => {
        // Check if the response status is successful (e.g., HTTP status 2xx).
        // if (response.status >= 200 && response.status < 300) {
        //   toast.success("Successfull!");
        //   setIsMailEnabled(!isMailEnabled);
        // } else {
        //   // Handle any other unexpected response status codes as errors.
        //   toast.error("Error Occurred! on response" + response);
        // }
        if (response) {
          toast.success("Successfully updated!");
          setIsMailEnabled(
            (response as any).send_status == 1 && (response as any).sync_status == 1
          );
          mailbox = response as any;
          setIsMailboxDefault(mailbox.is_default);
          setMailboxesFetchAgain(true);
        } else {
          // Handle any other unexpected response status codes as errors.
          toast.error("Error Occurred! on response" + response);
        }
      })
      .catch((error) => {
        // Handle network errors, timeouts, or other issues.
        console.error("Network Error:", error);
        toast.error(error?.response.data.error + " " + error.response.data.message);
      });
    setIsPending(false);
  }

  async function onChangeRotatingStatus(val: any) {
    setIsPending(true);
    await axios(true)
      .put(`${process.env.REACT_APP_PLAYBOOK_API_URL}/mailboxes/${mailbox.id}/toggle-rotating`)
      .then((response) => {
        // Check if the response status is successful (e.g., HTTP status 2xx).
        // if (response.status >= 200 && response.status < 300) {
        //   toast.success("Successfull!");
        //   setIsRotatingEnabled(!isRotatingEnabled);
        // } else {
        //   // Handle any other unexpected response status codes as errors.
        //   toast.error("Error Occurred! on response" + response);
        // }
        if (response) {
          toast.success("Successfully updated Rotation!");
          const isRotating = (response as any).is_rotating;
          setIsRotatingEnabled(isRotating);
          mailbox = response as any;
        } else {
          // Handle any other unexpected response status codes as errors.
          toast.error("Error Occurred! on response" + response);
        }
      })
      .catch((error) => {
        // Handle network errors, timeouts, or other issues.
        console.error("Network Error:", error);
        toast.error(error?.response.data.error + " " + error.response.data.message);
      });
    setIsPending(false);
  }

  async function handleLogClick() {
    setShowErrorLogs(true);
  }

  async function handleUpdateClick() {
    setShowUpdateMail(true);
  }

  async function handleDeleteClick() {
    setShowDelete(true);
  }

  return (
    <>
      <ErrorsModal
        mailbox={mailbox}
        show={showErrorLogs}
        onClose={() => setShowErrorLogs(false)}
      ></ErrorsModal>
      <UpdateMailBoxModal
        mailbox={mailbox}
        show={showUpdateMail}
        onClose={() => setShowUpdateMail(false)}
        setMailboxesFetchAgain={setMailboxesFetchAgain}
      ></UpdateMailBoxModal>
      <DeleteModal
        isPending={isPending}
        open={showDelete}
        onClose={() => setShowDelete(false)}
        title='Do you want to delete this MailBox?'
        handleDelete={async () => {
          setIsPending(true);
          await handleDeleteMail(mailbox.id);
          setIsPending(false);
          setShowDelete(false);
        }}
      ></DeleteModal>
      <div
        className={`rounded-lg shadow-md p-8 mb-8 dark:bg-gray-800 dark:text-white bg-white text-black`}
      >
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <span>
              <Icon
                name={mailbox.provider === 1 ? "Envelop" : "Logo"}
                className={`w-40 h-40 p-5 dark:text-blue-300 text-blue-600`}
              />
            </span>
            <div className='space-y-2'>
              <div className='flex lg:flex-row flex-col'>
                <div className='flex flex-col'>
                  <span
                    className={`text-md font-bold dark:text-white text-black w-200 truncate cursor-pointer`}
                    onClick={handleUpdateClick}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                  >
                    {mailbox.email}
                  </span>
                  {showTooltip && (
                    <div className='absolute mx-auto bg-gray-700 text-white dark:bg-gray-200 dark:text-black ext-md font-bold rounded py-1 px-2 mt-30 w-max'>
                      {mailbox.email}
                    </div>
                  )}
                  <span className={`text-sm dark:text-gray-400 text-gray-500 w-200`}>
                    Last updated {new Date(mailbox.updated_at).toLocaleDateString()}
                  </span>
                </div>
                <div className='flex items-center lg:flex-row flex-col'>
                  <span className={`text-sm text-blue-600 dark:text-blue-400 pl-8 ml-8 pr-8 w-160`}>
                    {Providers[mailbox.provider].value}
                  </span>
                  <div className='flex items-center space-x-1 pl-10 ml-10 w-100'>
                    <div className='flex flex-col items-start '>
                      <span
                        className={`text-sm ${
                          mailbox.send_status === 0
                            ? "dark:text-gray-400 text-gray-600"
                            : mailbox.send_status === 1
                            ? "dark:text-green-400 text-green-600"
                            : "dark:text-red-400 text-red-600"
                        } `}
                      >
                        Sending
                      </span>
                      <span
                        className={`text-sm ${
                          mailbox.send_status === 0
                            ? "dark:text-gray-400 text-gray-600"
                            : mailbox.send_status === 1
                            ? "dark:text-green-400 text-green-600"
                            : "dark:text-red-400 text-red-600"
                        } `}
                      >
                        ({mailboxStatus[mailbox.send_status]})
                      </span>
                    </div>
                  </div>
                  <div className='flex items-center space-x-1 pl-8 ml-8 w-100'>
                    <div className='flex flex-col items-start '>
                      <span
                        className={`text-sm ${
                          mailbox.sync_status === 0
                            ? "dark:text-gray-400 text-gray-600"
                            : mailbox.sync_status === 1
                            ? "dark:text-green-400 text-green-600"
                            : "dark:text-red-400 text-red-600"
                        } `}
                      >
                        Syncing
                      </span>
                      <span
                        className={`text-sm ${
                          mailbox.sync_status === 0
                            ? "dark:text-gray-400 text-gray-600"
                            : mailbox.sync_status === 1
                            ? "dark:text-green-400 text-green-600"
                            : "dark:text-red-400 text-red-600"
                        } `}
                      >
                        ({mailboxStatus[mailbox.sync_status]})
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-sm dark:text-red-400 text:text-red-600 cursor-pointer w-80`}
                    onClick={handleLogClick}
                  >
                    {isPending ? (
                      <ReactLoading type='bars' width={24} height={21} color={"#2285E1"} />
                    ) : (
                      <span className={"flex items-center"}>
                        <Icon
                          name={mailbox.provider === 1 || mailbox.provider === 2 ? "GoLog" : "Logo"}
                          className={`w-40 h-40 p-5 dark:text-red-300 text-red-600 cursor-pointer pl-8`}
                        />
                        <span>Logs</span>
                      </span>
                    )}
                  </span>
                  <span className='w-60'>
                    {isPending ? (
                      <ReactLoading type='bars' width={24} height={21} color={"#2285E1"} />
                    ) : (
                      <Icon
                        name={mailbox.provider === 1 || mailbox.provider === 2 ? "EditPen" : "Logo"}
                        className={`w-40 h-35 p-5 dark:text-green-300 text-green-600 cursor-pointer pl-8`}
                        onClick={handleUpdateClick}
                      />
                    )}
                  </span>
                  <span className='w-60'>
                    {isPending ? (
                      <ReactLoading type='bars' width={24} height={21} color={"#2285E1"} />
                    ) : (
                      <Icon
                        name={mailbox.provider === 1 || mailbox.provider === 2 ? "Trash" : "Logo"}
                        className={`w-40 h-40 p-5 dark:text-red-300 text-red-600 cursor-pointer pl-8`}
                        onClick={handleDeleteClick}
                      />
                    )}
                  </span>
                  <span className={`pl-12 w-100 flex items-center justify-center`}>
                    {isPending ? (
                      <ReactLoading type='bars' width={24} height={21} color={"#2285E1"} />
                    ) : (
                      <>
                        <span className='pr-4'>Rotation </span>
                        <Switch
                          checked={isRotatingEnabled}
                          onChange={(val) => onChangeRotatingStatus(val)}
                          className={`relative inline-flex h-18 w-30 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 ${
                            isRotatingEnabled ? "bg-primary" : "bg-neutral-400"
                          }`}
                        >
                          <span
                            aria-hidden='true'
                            className={`translate-x-0 pointer-events-none inline-block h-14 w-14 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                              isRotatingEnabled ? "translate-x-12" : "translate-x-0"
                            }`}
                          />
                        </Switch>
                      </>
                    )}
                  </span>
                  <span className={`pl-24 w-100 flex items-center justify-center`}>
                    {isPending ? (
                      <ReactLoading type='bars' width={24} height={21} color={"#2285E1"} />
                    ) : (
                      <>
                        <span className='pr-4'>Status </span>
                        <Switch
                          checked={isMailEnabled}
                          onChange={(val) => onChangeMailStatus(val)}
                          className={`relative inline-flex h-18 w-30 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 ${
                            isMailEnabled ? "bg-primary" : "bg-neutral-400"
                          }`}
                        >
                          <span
                            aria-hidden='true'
                            className={`translate-x-0 pointer-events-none inline-block h-14 w-14 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                              isMailEnabled ? "translate-x-12" : "translate-x-0"
                            }`}
                          />
                        </Switch>
                      </>
                    )}
                  </span>
                  <span className={`pl-24 w-100 flex items-center justify-center`}>
                    {isPending ? (
                      <ReactLoading type='bars' width={24} height={21} color={"#2285E1"} />
                    ) : (
                      <>
                        <span className='pr-4'>Default </span>
                        <Switch
                          checked={isMailboxDefault}
                          onChange={(val) => onChangeMailDefault(val)}
                          className={`relative inline-flex h-18 w-30 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 ${
                            isMailboxDefault ? "bg-primary" : "bg-neutral-400"
                          }`}
                        >
                          <span
                            aria-hidden='true'
                            className={`translate-x-0 pointer-events-none inline-block h-14 w-14 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                              isMailboxDefault ? "translate-x-12" : "translate-x-0"
                            }`}
                          />
                        </Switch>
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MailBoxRow;
