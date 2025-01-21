import React, { useEffect, useMemo, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import Content from "./Content";
import Icon from "src/components/base/Icon";
import InBoxItem from "./InboxItem";
import Input from "src/components/base/Input";
import ReactAvatar from "src/components/modules/Avatar";
import { IResThreads, IThread } from "src/utils/types/inbox";
import { inboxApi } from "src/api/inbox";
import ReactLoading from "react-loading";
import { BarLoader } from "react-spinners";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const InboxPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);

  const [currentThread, setCurrentThread] = useState<IThread>();
  const [threads, setThreads] = useState<IThread[]>([]);

  const [text, setText] = useState("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(0);

  const handleGetInboxThreads = async (page?: number) => {
    setIsLoading(true);
    try {
      const params = {
        order: "desc",
        page: page ?? 1,
      };
      const res = await inboxApi.getInboxThreads(params);
      const threadRes = res?.data as IResThreads;
      setThreads(threadRes?.data);
      if (threadRes?.data?.length > 0) {
        setCurrentThread(threadRes.data[0]);
      }
      setLastPage(threadRes?.last_page);
    } catch (error) {
      // console.log("error: ", error);
    }
    setIsLoading(false);
  };

  const handleGetMore = async () => {
    try {
      const params = {
        order: "desc",
        page: currentPage + 1,
      };
      const res = await inboxApi.getInboxThreads(params);
      const threadRes = res?.data as IResThreads;
      if (threads) {
        setThreads(() => [...threads, ...threadRes?.data]);
      }
      setCurrentPage((prev) => prev + 1);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const handleRemoveFromList = (id: number) => {
    const updatedList = [...threads]?.filter((item) => item?.id !== id);
    setThreads(updatedList);
  };

  useEffect(() => {
    handleGetInboxThreads();
  }, []);

  const filteredConversation = useMemo(() => {
    if (!!text?.length) {
      const result = threads?.filter((item) =>
        item?.user_name?.toLowerCase()?.includes(text?.toLowerCase())
      );
      return result;
    } else {
      return threads;
    }
  }, [text, threads]);

  return isLoading && threads?.length === 0 ? (
    <div className='fixed inset-0 flex items-center justify-center w-screen h-screen'>
      <BarLoader color='#2285E1' width={230} height={5} />
    </div>
  ) : (
    <div>
      <h2 className='font-normal select-none text-25 text-neutral-800 dark:text-neutral-300'>
        Unified Inbox
      </h2>
      <div className='flex '>
        <div className='flex-1'>
          <div className='flex items-center justify-between w-full py-16 border-r px-13 border-contentColor2 dark:border-contentColor-dark2'>
            <div className='text-16 text-neutral-800 dark:text-neutral-300'>
              <div className='relative'>
                <Input
                  divClassName='w-270'
                  placeholder='Search Inbox'
                  value={text}
                  onKeyDown={(event: any) => {
                    if (event.code == "Enter") {
                      setText(event?.target?.value);
                    }
                  }}
                  onChange={(event) => setText(event?.target?.value)}
                />
                <Icon
                  name='Cross'
                  className='absolute -translate-y-1/2 w-22 h-22 right-10 text-neutral-700 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-300 top-1/2'
                  onClick={() => {
                    setText("");
                  }}
                />
                <div className='absolute mt-2 -translate-y-1/2 top-1/2 right-30'></div>
              </div>
            </div>
            {/* <div className='flex gap-10'>
              <div className='p-6 border rounded-md cursor-pointer bg-primary-1 border-primary-1'>
                <Icon name='HandUp' className='w-20 h-20 text-white' />
              </div>
              <div className='p-6 border rounded-md cursor-pointer bg-primary-1 border-primary-1'>
                <Icon name='DownLoad' className='w-20 h-20 text-white' />
              </div>
            </div> */}
          </div>
          <div className='flex border-t border-contentColor2 dark:border-contentColor-dark2'>
            <div className='w-full max-w-300'>
              <div className='h-full max-h-[calc(100vh-212)] overflow-auto scrollbar-thumb-neutral-300 border-l border-b dark:border-borderColor-dark border-borderColor'>
                {filteredConversation?.length > 0 ? (
                  !!text?.length ? (
                    <div
                      className='flex flex-col h-full overflow-auto scrollbar-thin dark:scrollbar-thumb-neutral-800'
                      style={{ height: "calc(100vh - 210px)" }}
                    >
                      {filteredConversation?.map((item: IThread) => (
                        <InBoxItem
                          active={item.id === currentThread?.id}
                          onClick={() => {
                            if (!messageLoading) {
                              setCurrentThread(item);
                            }
                          }}
                          key={item.id}
                          avatar={item.st_profile_url}
                          name={item.user_name}
                          message={item.message_last}
                          timestamp={item?.received_last_at}
                          messageType={item?.message_type}
                          id={item.id}
                        />
                      ))}
                    </div>
                  ) : (
                    <InfiniteScroll
                      className='overflow-auto scrollbar-thin dark:scrollbar-thumb-neutral-800'
                      dataLength={filteredConversation?.length ?? 0}
                      next={() => {
                        handleGetMore();
                      }}
                      endMessage={
                        <div className='flex justify-center w-full'>
                          <p className='pb-12 text-primary text-13'>- The End -</p>
                        </div>
                      }
                      hasMore={currentPage >= lastPage ? false : true}
                      height={window.innerHeight - 210}
                      loader={
                        <div className='flex justify-center pb-8'>
                          <ReactLoading
                            className='m-0 p-0 !h-24'
                            type={"spin"}
                            color='#2285E1'
                            width={24}
                          />
                        </div>
                      }
                      scrollableTarget='scrollableDiv'
                    >
                      {filteredConversation?.map((item: IThread) => (
                        <InBoxItem
                          active={item.id === currentThread?.id}
                          onClick={() => {
                            if (!messageLoading) {
                              setCurrentThread(item);
                            }
                          }}
                          key={item.id}
                          avatar={item.st_profile_url}
                          name={item.user_name}
                          message={item.message_last}
                          timestamp={item?.received_last_at}
                          messageType={item?.message_type}
                          id={item.id}
                          handleRemove={handleRemoveFromList}
                        />
                      ))}
                    </InfiniteScroll>
                  )
                ) : (
                  <div className='flex items-center justify-center h-full'>
                    <p className='title-1'>No Result!</p>
                  </div>
                )}
              </div>
            </div>
            <Content
              currentThread={currentThread}
              messageLoading={messageLoading}
              setMessageLoading={setMessageLoading}
            />
          </div>
        </div>
        <div className='w-250'>
          {currentThread ? (
            <div className='px-16 pt-16'>
              <div className='flex flex-col items-center justify-center gap-6 pb-10'>
                <ReactAvatar
                  className='rounded-lg'
                  name={currentThread?.user_name?.replace(/^(\w)\w*\s(\w)\w*.*$/, "$1 $2")}
                  size='70'
                  src={currentThread?.li_profile_img_url ?? ""}
                />
                <Link to={currentThread?.st_profile_url} target='_blank'>
                  <p className='text-neutral-800 dark:text-neutral-300 text-15 hover:underline'>
                    {currentThread?.user_name}
                  </p>
                </Link>
              </div>
              <div className='flex flex-col gap-6 px-12 py-12'>
                {/* <p className='text-neutral-600 dark:text-neutral-400 text-14'>
                  Email: <span className='pr-4 title-1'> andrey@superman.com</span>
                </p>
                <p className='text-neutral-600 dark:text-neutral-400 text-14'>
                  Description: <span className='pr-4 title-1'>VP sales</span>
                </p>
                <p className='text-neutral-600 dark:text-neutral-400 text-14'>
                  Location:<span className='pr-4 title-1'>London, UK</span>
                </p> */}
                <p className='text-neutral-600 dark:text-neutral-400 text-14 whitespace-nowrap'>
                  Company: <span className='pr-4 title-1'>{currentThread?.company_name}</span>
                </p>
                <p className='text-neutral-600 dark:text-neutral-400 text-14'>
                  Tag: <span className='pr-4 title-1'>{currentThread?.tag}</span>
                </p>
                <p className='text-neutral-600 dark:text-neutral-400 text-14 whitespace-nowrap'>
                  First Prospected:{" "}
                  <span className='pr-4 title-1'>
                    {currentThread?.first_prospected_at
                      ? format(new Date(currentThread?.first_prospected_at), "dd/MM/yyyy h:mm a")
                      : ""}
                  </span>
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default InboxPage;
