import React, { useEffect, useMemo, useState } from "react";
import ReactLoading from "react-loading";
import ReactQuill from "react-quill";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import Button from "src/components/base/Button";
import Modal from "src/components/base/Modal";
import ReactSelect from "src/components/base/ReactSelect";
import ReactAvatar from "src/components/modules/Avatar";
import { inboxApi } from "src/api/inbox";
import { authSelector } from "src/store/Auth";
import { IInboxMessage, IThread } from "src/utils/types/inbox";

type Props = {
  currentThread?: IThread;
  messageLoading: boolean;
  setMessageLoading: Function;
};

type TMessage = {
  message: string;
  current?: any;
};

const numberDays = [
  { label: "1 Day", value: 1 },
  { label: "2 Days", value: 2 },
  { label: "3 Days", value: 3 },
  { label: "4 Days", value: 4 },
  { label: "5 Days", value: 5 },
  { label: "6 Days", value: 6 },
  { label: "7 Days", value: 7 },
  { label: "14 Days", value: 14 },
  { label: "30 Days", value: 30 },
];

const Message: React.FC<TMessage> = ({ message, current }) => {
  const removedTags = message
    ?.replace(/<head>[\s\S]*?<\/head>/gi, "")
    .replace(/<\/?html>/gi, "")
    .replace(/<\/?body>/gi, "");
  return (
    <div style={{ width: "100%" }}>
      <p
        style={{
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          whiteSpace: "pre-wrap",
        }}
        id={`target${current}`}
      >
        <div
          className='dangerously-html title-1'
          dangerouslySetInnerHTML={{ __html: removedTags }}
        />
      </p>
    </div>
  );
};

const Content: React.FC<Props> = ({ currentThread, messageLoading, setMessageLoading }) => {
  const [messages, setMessages] = useState<IInboxMessage[]>();
  const [isLoading, setIsLoading] = useState(false);
  const { userInfo, cookieInfo } = useSelector(authSelector);
  const [modalShow, setModalShow] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number>();
  const [message, setMessage] = useState("");
  const [delayLoading, setDelayLoading] = useState(false);

  const lastMessage = useMemo(() => {
    if (messages && messages?.length > 0) {
      return messages.at(-1);
    }
  }, [messages]);

  const getMessage = async () => {
    try {
      if (currentThread) {
        const res = await inboxApi.getMessages(currentThread?.id);
        setMessages(res?.data);
      }
    } catch (error) {
      // console.log("error: ", error);
    }
  };

  const handleGetMessages = async () => {
    setMessageLoading(true);
    try {
      if (currentThread) {
        const res = await inboxApi.getMessages(currentThread?.id);
        setMessages(res?.data);
      }
    } catch (error) {
      console.error("error: ", error);
    }
    setMessageLoading(false);
  };

  const handleDelay = async () => {
    setDelayLoading(true);
    try {
      await inboxApi.inboxSnooze(currentThread?.id, selectedDay);
      toast.success("Snooze message successfully!");
      setSelectedDay(null);
      setModalShow(false);
    } catch (error) {
      console.error("error: ", error);
    }
    setDelayLoading(false);
  };

  useEffect(() => {
    if (currentThread && currentThread?.id) {
      handleGetMessages();
    }
  }, [currentThread]);

  const handleSendMessage = async () => {
    setIsLoading(true);
    try {
      if (cookieInfo && cookieInfo.cookie_invalid) {
        toast.warn("You can`t send messages until you update your cookie.");
      } else if (
        lastMessage &&
        lastMessage.is_reply === 1 &&
        lastMessage.is_replied_confirmed === null
      ) {
        toast.warn("You can`t send messages until you get a response.");
      } else {
        await inboxApi.sendMessages(currentThread?.id, { message });
        await getMessage();
        setMessage("");
        setModalShow(true);
      }
    } catch (error) {
      // console.log("error: ", error);
    }
    setIsLoading(false);
  };

  return (
    <>
      <div className='flex-1 h-[calc(100vh-210px)] border-b bg-contentColor2 dark:bg-contentColor-dark2/10  pl-10 pt-0 flex border-l border-r  dark:border-borderColor-dark border-borderHoverColor'>
        <div className='h-[calc(100vh-210px)] w-full flex flex-col'>
          <div
            className={`flex-1 pb-10 flex flex-col w-full gap-10 px-4 overflow-auto scrollbar-1 pr-10 pt-10`}
          >
            {messageLoading ? (
              <div className='flex items-center justify-center w-full h-full'>
                <ReactLoading className='mt-25' type={"spin"} color='#2285E1' width={55} />
              </div>
            ) : (
              <>
                {messages?.map((item, index) => {
                  return item?.is_owner ? (
                    <div className='flex justify-end w-full'>
                      <div className='flex items-start gap-10 max-w-800'>
                        <div className='flex flex-col gap-4'>
                          <div className='p-8 rounded-md bg-contentColor dark:bg-neutral-800 title-1'>
                            <div className='title-1 text-15'>
                              <Message message={item.message} current={index} />
                            </div>
                          </div>
                          <p className='px-4 title-2 text-12'>26 Oct 2023 - 01:25</p>
                        </div>
                        <ReactAvatar
                          name={userInfo?.full_name ?? ""}
                          src={userInfo?.avatar ?? ""}
                          size='50'
                          className='rounded-md'
                        />
                      </div>
                    </div>
                  ) : (
                    <div className='flex justify-start gap-10'>
                      <div className='flex items-start gap-10 max-w-800'>
                        <ReactAvatar
                          name={currentThread?.user_name ?? ""}
                          src={currentThread?.li_profile_img_url ?? ""}
                          size='50'
                          className='rounded-md'
                        />
                        <div className='flex flex-col gap-4'>
                          <div className='p-8 rounded-md bg-contentColor dark:bg-neutral-800 title-1'>
                            <div className='title-1 text-15'>
                              <Message message={item.message} current={index} />
                            </div>
                          </div>
                          <p className='px-4 title-2 text-12'>26 Oct 2023 - 01:25</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
          <div
            className='bottom-0 pb-10 pr-10 border-b bg-contentColor2 dark:bg-inbox-1 dark:border-borderColor-dark border-borderHoverColor'
            style={{ maxWidth: "1178px" }}
          >
            <ReactQuill
              className='react-quill inbox'
              value={message}
              onChange={(val: string) => setMessage(val)}
            />
            <Button
              buttonClassName='flex justify-end pt-10'
              className='w-120'
              isPending={isLoading}
              onClick={() => handleSendMessage()}
            >
              Send Message
            </Button>
          </div>
        </div>
      </div>
      <Modal show={modalShow} onClose={() => setModalShow(false)} className='flex flex-col w-550'>
        <div className='flex flex-col gap-12 py-16'>
          <div>
            <p className='pb-10 text-center title-1 text-24'>Notification</p>
          </div>
          <h2 className='px-20 text-center title-1 text-18'>
            Do you want this message to resurface, as a reminder to follow up?
          </h2>
          <ReactSelect
            top
            label='Number of Days'
            smallMenu
            options={numberDays}
            onChange={(option) => {
              setSelectedDay(option?.val);
            }}
            value={numberDays?.find((item) => item.value === selectedDay)}
          />
          <div className='flex justify-center gap-16 pt-10'>
            <Button
              onClick={(event) => {
                event.stopPropagation();
                handleDelay();
              }}
              isPending={delayLoading}
            >
              Yes
            </Button>
            <Button buttonStyle='secondary' onClick={() => setModalShow(false)}>
              No
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Content;
