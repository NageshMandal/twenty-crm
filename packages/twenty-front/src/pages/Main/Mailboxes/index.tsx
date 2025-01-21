import React, { useEffect, useState } from "react";
import axios from "src/utils/functions/axios";
import { AxiosError } from "axios";
import MailBoxRow from "./MailBoxRow";
import BarLoader from "react-spinners/BarLoader";
import Icon from "src/components/base/Icon";
import Button from "src/components/base/Button";
import { toast } from "react-toastify";
import UpdateMailBoxModal from "./UpdateMailBoxModal";
import MailBoxChooserModal from "./MailBoxChooserModal";
import { authSelector, getUserInfo } from "src/store/Auth";
import { useAppSelector } from "src/hook/redux/useStore";
import GmailModal from "src/components/base/GmailModal";

const MailBoxesPage: React.FC = () => {
  const { userInfo } = useAppSelector(authSelector);

  const [mailboxes, setMailboxes] = useState<any>();
  const [mailboxesFetching, setMailboxesFetching] = useState<any>(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [showUpdateMail, setShowUpdateMail] = useState(false);
  const [showAddMail, setShowAddMail] = useState(false);
  const [mailboxesFetchAgain, setMailboxesFetchAgain] = useState(false);
  const [showGmailModal, setShowGmailModal] = useState(false);
  const [isGmailPending, setIsGmailPending] = useState(false);

  const fetchMailboxes = async () => {
    if (!mailboxesFetching || mailboxesFetchAgain) {
      setIsPageLoading(true);
      try {
        const response = await axios(true).get(
          `${process.env.REACT_APP_PLAYBOOK_API_URL}/mailboxes`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response) {
          // console.log("Emailbb Response: ", response);
          const traverseAndModify = (data: any): any => {
            if (Array.isArray(data)) {
              return data.map((item) => traverseAndModify(item));
            } else if (typeof data === "object") {
              for (const key in data) {
                data[key] = traverseAndModify(data[key]);
                if (key === "email" && data[key]) {
                  data.label = data[key]; // Reassign email as lab
                  // data.value = data[key];
                }
                if (key === "id" && data[key]) {
                  data.value = data[key];
                }
              }
            }
            return data;
          };

          // const modifiedResponse = traverseAndModify(response);
          // console.log("Emailab Response: ", modifiedResponse);
          setMailboxes(response);
        }
      } catch (error) {
        console.error("Email Template Loading:", error);
      }
      setIsPageLoading(false);
    }
  };
  useEffect(() => {
    if (!mailboxesFetching) {
      fetchMailboxes();
      setMailboxesFetching(true);
      setMailboxesFetchAgain(false);
    }
  }, []);
  useEffect(() => {
    if (mailboxesFetchAgain) {
      setMailboxesFetching(false);
      fetchMailboxes();
      setMailboxesFetching(true);
      setMailboxesFetchAgain(false);
      // console.log("fetching again");
    }
  }, [mailboxesFetchAgain]);

  async function handleDeleteMail(mailboxId: any) {
    try {
      await axios(true).delete(`${process.env.REACT_APP_PLAYBOOK_API_URL}/mailboxes/${mailboxId}`);
      toast.success("Mailbox deleted successfully");
      // setShowDelete(false);
      fetchMailboxes();
      setMailboxes((prevMailboxes) => prevMailboxes.filter((mailbox) => mailbox.id !== mailboxId));
    } catch (error) {
      console.error("Error deleting mailbox:", error);
      toast.error("Error deleting mailbox. Please try again.");
    }
  }

  async function handleUpdateClick() {
    setShowUpdateMail(true);
  }

  async function handleAddClick() {
    setShowAddMail(true);
  }

  const handleSmtp = () => {
    // Handle SMTP card click
    // toast.success("SMTP is coming soon!");
    handleUpdateClick();
  };

  const handleGmail = async () => {
    setIsGmailPending(true);
    // Handle Gmail card click
    // toast.success("G-Suite is coming soon!");
    // await axios(true)
    //   .get(`${process.env.REACT_APP_PLAYBOOK_API_URL}/sequences/statistics`)
    //   .then((response) => {});
    // window.open(
    //   `${process.env.REACT_APP_PLAYBOOK_API_URL}/mailboxes/oauth/2`,
    //   "Oauth Window",
    //   "width=600, height=600"
    // );
    // const token = localStorage.getItem("token");
    // document.cookie = `token=${token}; path=/; domain=.usedemand.com`;
    // // document.cookie = `tokenAuth=${token}; path=/`;
    // // document.cookie = `amplitude_id_4ed40bb19873018f06f1e2350c2674d0usedemand.com=${token}; path=/`;
    // const amplitudeInstance = amplitude.getInstance();
    // amplitudeInstance.init("4ed40bb19873018f06f1e2350c2674d0");
    // amplitudeInstance.setUserId(userInfo.id);
    // const identify = new amplitude.Identify();
    // const data = userInfo;
    // for (const key in data) {
    //   let value = data[key];
    //   let action = actions.SET;
    //   if (Array.isArray(value)) {
    //     [action, value] = value;
    //   }
    //   identify[methods[action]](key, value);
    // }
    // amplitudeInstance.identify(identify);
    //the work done
    try {
      const response = await axios(true).get(
        `${process.env.REACT_APP_PLAYBOOK_API_URL}/mailboxes/oauth/2`
      );
      console.log("response from oauth playbook", response);
      window.location.href = `${response as any}`;
      window.onmessage = function (e) {
        if (e.data.status && e.data.mailbox) {
          if (e.data.status === true) {
            toast.success("Google is Integrated Successfully!");
            const mailbox = e.data.mailbox;
            mailbox.send_status = 1;
            mailbox.sync_status = 1;
          }
          setMailboxesFetchAgain(true);
        } else {
          // toast.error("Oauth error. Please try again");
        }
      };
    } catch (error: unknown) {
      if (error instanceof Error && "isAxiosError" in error) {
        const axiosError = error as AxiosError;
        console.log("Error caught:", axiosError);
        if (axiosError.response) {
          // The request was made, but the server responded with a non-2xx status
          console.log("Server responded with:", axiosError.response.status);
          console.log("Response data:", axiosError.response.data);
        } else if (axiosError.request) {
          // The request was made, but no response was received
          console.log("No response received");
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error during request setup:", axiosError.message);
        }
      } else {
        // Handle other types of errors (not AxiosError)
        console.log("Non-Axios error caught:", error);
      }
    }
    // window.location.href = `${process.env.REACT_APP_PLAYBOOK_API_URL}/mailboxes/oauth/2`;
    // window.onmessage = function (e) {
    //   if (e.data.status && e.data.mailbox) {
    //     if (e.data.status === true) {
    //       toast.success("Google is Integrated Successfully!");
    //       const mailbox = e.data.mailbox;
    //       mailbox.send_status = 1;
    //       mailbox.sync_status = 1;
    //     }
    //     setMailboxesFetchAgain(true);
    //   } else {
    //     // toast.error("Oauth error. Please try again");
    //   }
    // };
    setIsGmailPending(false);
  };

  const handleOffice = async () => {
    // Handle Office card click
    // toast.success("Office is coming soon!");
    // await axios(true)
    //   .get(`${process.env.REACT_APP_PLAYBOOK_API_URL}/sequences/statistics`)
    //   .then((response) => {});
    // window.open(
    //   `${process.env.REACT_APP_PLAYBOOK_API_URL}/mailboxes/oauth/6`,
    //   "Oauth Window",
    //   "width=600, height=600"
    // );
    // window.location.href = `${process.env.REACT_APP_PLAYBOOK_API_URL}/sequences/statistics`;
    // window.onmessage = function (e) {
    //   if (e.data.status && e.data.mailbox) {
    //     if (e.data.status === true) {
    //       toast.success("Office 365 is Integrated Successfully!");
    //       const mailbox = e.data.mailbox;
    //       mailbox.send_status = 1;
    //       mailbox.sync_status = 1;
    //     }
    //   } else {
    //     // toast.error("Oauth error. Please try again");
    //   }
    // };
    try {
      const response = await axios(true).get(
        `${process.env.REACT_APP_PLAYBOOK_API_URL}/mailboxes/oauth/6`
      );
      console.log("response from oauth playbook", response);
      window.location.href = `${response as any}`;
      window.onmessage = function (e) {
        if (e.data.status && e.data.mailbox) {
          if (e.data.status === true) {
            toast.success("Google is Integrated Successfully!");
            const mailbox = e.data.mailbox;
            mailbox.send_status = 1;
            mailbox.sync_status = 1;
          }
          setMailboxesFetchAgain(true);
        } else {
          // toast.error("Oauth error. Please try again");
        }
      };
    } catch (error: unknown) {
      if (error instanceof Error && "isAxiosError" in error) {
        const axiosError = error as AxiosError;

        console.log("Error caught:", axiosError);

        if (axiosError.response) {
          // The request was made, but the server responded with a non-2xx status
          console.log("Server responded with:", axiosError.response.status);
          console.log("Response data:", axiosError.response.data);
        } else if (axiosError.request) {
          // The request was made, but no response was received
          console.log("No response received");
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error during request setup:", axiosError.message);
        }
      } else {
        // Handle other types of errors (not AxiosError)
        console.log("Non-Axios error caught:", error);
      }
    }
  };

  return (
    <div>
      <UpdateMailBoxModal
        mailbox={null}
        show={showUpdateMail}
        onClose={() => setShowUpdateMail(false)}
        setMailboxesFetchAgain={setMailboxesFetchAgain}
      ></UpdateMailBoxModal>
      <MailBoxChooserModal
        show={showAddMail}
        onClose={() => setShowAddMail(false)}
        handleSmtp={handleSmtp}
        handleGmail={() => setShowGmailModal(true)}
        handleOffice={handleOffice}
      ></MailBoxChooserModal>
      <GmailModal
        show={showGmailModal}
        onClose={() => setShowGmailModal(false)}
        handleGmail={handleGmail}
        isGmailPending={isGmailPending}
      ></GmailModal>
      <div className='flex items-center justify-between'>
        <div className='flex items-center justify-start gap-20'>
          <h2 className='font-normal select-none text-25 text-neutral-800 dark:text-neutral-300'>
            MailBoxes
          </h2>
        </div>
        <div className='flex items-center justify-end pr-8 mb-4'>
          <Button isPending={isPageLoading} prefix='EditPen' onClick={handleAddClick}>
            Add New MailBox
          </Button>
        </div>
      </div>
      <div>
        {isPageLoading ? (
          <div className='fixed inset-0 flex items-center justify-center w-screen h-screen'>
            <BarLoader color='#2285E1' width={230} height={5} />
          </div>
        ) : (
          <div className='nowheel scrollbar-1 pt-4 mt-4'>
            {mailboxes?.map((mailbox) => (
              <MailBoxRow
                mailbox={mailbox}
                handleDeleteMail={handleDeleteMail}
                setMailboxesFetchAgain={setMailboxesFetchAgain}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MailBoxesPage;
