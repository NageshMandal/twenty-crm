import React, { useEffect, useMemo, useRef, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { ReactCountryFlag } from "react-country-flag";
import { format, subDays, startOfDay } from "date-fns";

import Icon from "src/components/base/Icon";
import ReactAvatar from "src/components/modules/Avatar";
import { ICompanyVisitor, IPeopleVisitor } from "src/utils/types/visitor";
import { countries } from "src/utils/constants/country";
import { visitorApi } from "src/api/visitor";
import ReactLoading from "react-loading";
import InfiniteScroll from "react-infinite-scroll-component";
import { Popover, Transition } from "@headlessui/react";
import useOutsideClick from "src/hook/common/useOutsideClick";

type ListPros = {
  item: IPeopleVisitor;
  setSelectedVisitor: Function;
  selectedVisitor: IPeopleVisitor;
  setSelectedCompany: Function;
};

type CompanyProps = {
  item: ICompanyVisitor;
  setSelectedCompany: Function;
  selectedCompany: ICompanyVisitor;
  setSelectedVisitor: Function;
};

const timeFilterList = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Last 7 Days", value: "7_days" },
  { label: "Last 14 Days", value: "14_days" },
  { label: "Last Month", value: "last_month" },
];

const PeopleRenderItem: React.FC<ListPros> = ({
  item,
  setSelectedVisitor,
  selectedVisitor,
  setSelectedCompany,
}) => (
  <div
    onClick={() => {
      setSelectedVisitor(item);
      setSelectedCompany(null);
    }}
    className={`flex items-center py-10 transition-all shadow-lg duration-150 justify-between gap-6 p-6 bg-contentColor dark:bg-contentColor-dark cursor-pointer ${
      selectedVisitor === item
        ? "bg-hoverColor2 dark:bg-hoverColor-dark"
        : "hover:bg-hoverColor dark:hover:bg-hoverColor-dark-2"
    }`}
  >
    <div className='flex items-center gap-6 py-4'>
      <ReactAvatar src={item?.image_url} name={item?.name} size='45' className='shadow-sm' />
      <div className='flex flex-col gap-4 pl-4'>
        <p className='font-medium text-14 text-neutral-800 dark:text-neutral-200'>{item?.name}</p>
        <div className='flex items-center w-full gap-4 text-neutral-700 dark:text-neutral-300'>
          <ReactCountryFlag
            svg
            style={{ height: "18px", width: "18px" }}
            countryCode={countries?.find((c) => c?.name === item.locations[0].country)?.code}
          />
          <div className='flex items-center justify-between flex-1 w-250'>
            <p className='truncate text-12 whitespace-nowrap'>{item.locations[0].city}</p>
            <p className='pr-6 text-12 whitespace-nowrap text-neutral-700 dark:text-neutral-300 '>
              {format(new Date(item?.updated_at), "YYY/MM/dd")}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div className='flex items-start h-full'></div>
  </div>
);

const CompanyRenderItem: React.FC<CompanyProps> = ({
  item,
  setSelectedCompany,
  selectedCompany,
  setSelectedVisitor,
}) => {
  const visitorScore = useMemo(() => {
    if (item) {
      const score = item?.visit_score
        ? item?.visit_score * 100 > 100
          ? 100
          : item?.visit_score * 100
        : 0;
      return score;
    }
  }, [item]);
  return (
    <div
      onClick={() => {
        setSelectedVisitor(null);
        setSelectedCompany(item);
      }}
      className={`mr-4 flex items-center transition-all duration-150 shadow-md justify-between gap-6 p-6 bg-contentColor dark:bg-contentColor-dark cursor-pointer ${
        selectedCompany === item
          ? "bg-hoverColor2 dark:bg-hoverColor-dark"
          : "hover:bg-hoverColor dark:hover:bg-hoverColor-dark-2"
      }`}
    >
      <div className='flex items-center gap-6'>
        <div className='flex items-end flex-none overflow-hidden bg-gray-300 rounded-full w-7 h-50'>
          <p
            className={`w-full  rounded-full flex-none  ${
              visitorScore > 70
                ? "bg-green-600 text-green-600"
                : visitorScore > 30
                ? "text-yellow-400 bg-yellow-400"
                : "text-error-1 bg-error-1"
            }`}
            style={{ height: `${visitorScore}%` }}
          ></p>
        </div>
        <div className='flex items-center py-4'>
          <ReactAvatar
            src={item?.company?.image_url ?? ""}
            name={item?.company?.name ?? ""}
            size='45'
            className='shadow-md'
          />
          <div className='flex flex-col gap-4 pl-10'>
            <p className='font-medium text-14 text-neutral-800 dark:text-neutral-200'>
              {item?.company.name}
            </p>
            <div className='flex items-center w-full gap-12 text-neutral-700 dark:text-neutral-300'>
              {item.company.locations.length > 0 ? (
                <ReactCountryFlag
                  svg
                  style={{ height: "18px", width: "18px" }}
                  countryCode={
                    countries?.find((c) => c?.name === item.company.locations[0].country)?.code
                  }
                />
              ) : (
                <div className='w-16 text-transparent'>{`flag`}</div>
              )}
              <div className='flex items-center justify-between flex-1 w-220'>
                <p className='truncate text-12 whitespace-nowrap'>
                  {item.company.locations.length > 0 ? item.company.locations[0].city : null}
                </p>
                <p className='pr-6 text-12 whitespace-nowrap title-2 dark:text-neutral-f300'>
                  {format(new Date(item?.updated_at), "YYY/MM/dd")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='flex items-start h-full'></div>
    </div>
  );
};

type Props = {
  setSelectedCompany: Function;
  selectedCompany: ICompanyVisitor;
  setSelectedVisitor: Function;
  selectedVisitor: IPeopleVisitor;
  peopleVisitorList: IPeopleVisitor[];
  setPeopleVisitorLst: Function;
  companyVisitorList: ICompanyVisitor[];
  setCompanyVisitorList: Function;
  setCompanyLoading: Function;
  companyLoading: boolean;
  setHash: Function;
};

const ListPanel: React.FC<Props> = ({
  selectedCompany,
  setSelectedCompany,
  selectedVisitor,
  setSelectedVisitor,
  peopleVisitorList,
  setPeopleVisitorLst,
  companyVisitorList,
  setCompanyVisitorList,
  setCompanyLoading,
  companyLoading,
  setHash,
}) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const ref = useRef<HTMLInputElement | null>(null);

  const [companyTime, setCompanyTime] = useState<string>("last_month");
  const [peopleTime, setPeopleTime] = useState<string>("last_month");
  const [visitorType, setVisitorType] = useState<"people" | "company">("company");

  const companyQuery = useMemo(() => {
    let query = "";
    switch (companyTime) {
      case "today":
        query = `@last_visited gt '${format(
          subDays(startOfDay(new Date()), 0),
          "YYY-MM-dd HH:mm:ss"
        )}'`;
        break;
      case "yesterday":
        query = `@last_visited gt '${format(
          subDays(startOfDay(new Date()), 1),
          "YYY-MM-dd HH:mm:ss"
        )}'`;
        break;
      case "7_days":
        query = `@last_visited gt '${format(
          subDays(startOfDay(new Date()), 7),
          "YYY-MM-dd HH:mm:ss"
        )}'`;
        break;
      case "14_days":
        query = `@last_visited gt '${format(
          subDays(startOfDay(new Date()), 14),
          "YYY-MM-dd HH:mm:ss"
        )}'`;
        break;
      case "last_month":
        query = `@last_visited gt '${format(
          subDays(startOfDay(new Date()), 30),
          "YYY-MM-dd HH:mm:ss"
        )}'`;
        break;
    }
    return query;
  }, [companyTime]);

  const peopleQuery = useMemo(() => {
    let query = "";
    switch (peopleTime) {
      case "today":
        query = `@last_visited gt '${format(
          subDays(startOfDay(new Date()), 0),
          "YYY-MM-dd HH:mm:ss"
        )}'`;
        break;
      case "yesterday":
        query = `@last_visited gt '${format(
          subDays(startOfDay(new Date()), 1),
          "YYY-MM-dd HH:mm:ss"
        )}'`;
        break;
      case "7_days":
        query = `@last_visited gt '${format(
          subDays(startOfDay(new Date()), 7),
          "YYY-MM-dd HH:mm:ss"
        )}'`;
        break;
      case "14_days":
        query = `@last_visited gt '${format(
          subDays(startOfDay(new Date()), 14),
          "YYY-MM-dd HH:mm:ss"
        )}'`;
        break;
      case "last_month":
        query = `@last_visited gt '${format(
          subDays(startOfDay(new Date()), 30),
          "YYY-MM-dd HH:mm:ss"
        )}'`;
        break;
    }
    return query;
  }, [peopleTime]);

  useOutsideClick(ref, () => {
    setPopoverOpen(false);
  });

  const [peopleTotal, setPeopleTotal] = useState(0);
  const [peoplePage, setPeoplePage] = useState(0);

  const [companyTotal, setCompanyTotal] = useState(0);
  const [companyPage, setCompanyPage] = useState(0);

  const hashMoreCompany = useMemo(() => {
    if ((companyVisitorList.length > 0, companyTotal)) {
      return companyVisitorList.length + 30 > companyTotal ? false : true;
    }
    return false;
  }, [companyVisitorList, companyTotal]);

  const hashMorePeople = useMemo(() => {
    if ((peopleVisitorList.length > 0, peopleTotal)) {
      return peopleVisitorList.length + 30 > peopleTotal ? false : true;
    }
    return false;
  }, [peopleVisitorList, peopleTotal]);

  const [peopleLoading, setPeopleLoading] = useState(false);

  const handleGetPeopleVisitors = async () => {
    setPeopleLoading(true);
    try {
      const params = {
        limit: 41,
        offset: 0,
        query: peopleQuery,
      };
      const res = (await visitorApi.getPeopleVisitor(params)) as unknown as any;
      setPeopleVisitorLst(res?.data);
      setHash(res?.prospector_history.hash);
      setPeopleTotal(res?.total);
    } catch (error) {
      console.error("error: ", error);
    }
    setPeopleLoading(false);
  };

  const handleGetMorePeople = async () => {
    try {
      const params = {
        limit: 40,
        offset: peoplePage + 1,
        query: peopleQuery,
      };
      const res = (await visitorApi.getPeopleVisitor(params)) as unknown as any;
      const newVisitors = res?.data as IPeopleVisitor[];
      setPeopleVisitorLst((prev) => [...prev, ...newVisitors]);
      setPeoplePage((prev) => prev + 1);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const handleGetCompanyVisitors = async () => {
    setCompanyLoading(true);
    try {
      const params = {
        limit: 30,
        offset: 0,
        query: companyQuery,
      };
      const res = (await visitorApi.getCompanyVisitor(params)) as unknown as any;
      setCompanyVisitorList(res?.data);
      setCompanyTotal(res?.total);
    } catch (error) {
      console.error("error: ", error);
    }
    setCompanyLoading(false);
  };

  const handleGetMoreCompany = async () => {
    try {
      const params = {
        limit: 30,
        offset: companyPage + 1,
        query: companyQuery,
      };
      const res = (await visitorApi.getCompanyVisitor(params)) as unknown as any;
      const newVisitors = res?.data as ICompanyVisitor[];
      setCompanyVisitorList((prev) => [...prev, ...newVisitors]);
      setCompanyPage((prev) => prev + 1);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    handleGetPeopleVisitors();
  }, [peopleQuery]);

  useEffect(() => {
    handleGetCompanyVisitors();
  }, [companyQuery]);

  return (
    <div className='w-full pt-16 border-r max-w-350 border-borderColor dark:border-borderColor-dark'>
      <div
        onClick={() => {
          if (visitorType === "company") {
            handleGetCompanyVisitors();
          }
          if (visitorType === "people") {
            handleGetPeopleVisitors();
          }
        }}
        className='flex items-center gap-6 px-4 font-medium transition-colors duration-75 cursor-pointer w-fit title-1 hover:text-primary dark:hover:text-primary'
      >
        <h2 className='text-14'>{visitorType === "company" ? "All Companies" : "All Peoples"}</h2>
        <Icon name='Rotate' className='w-18 h-18' />
      </div>

      <div className='flex items-center justify-between gap-6 px-4 py-16 pr-16'>
        <div className='flex gap-10'>
          <div
            className='flex items-center justify-between gap-4 cursor-pointer'
            onClick={() => {
              setVisitorType("company");
              setSelectedCompany(null);
              setSelectedVisitor(null);
            }}
          >
            <Icon
              name='Apartment'
              className={`${visitorType === "company" ? "text-primary " : " title-1"} w-18 h-18`}
            />
            <p
              className={`${
                visitorType === "company" ? "text-primary font-bold" : " title-1"
              } text-12 `}
            >
              Company
            </p>
            <p
              className={`${
                visitorType === "company" ? "bg-blue-600" : "bg-gray-500"
              } px-6 text-white  rounded-full text-12`}
            >
              {companyVisitorList?.length ?? 0}
            </p>
          </div>
          <div
            className='flex items-center gap-4 cursor-pointer'
            onClick={() => {
              setVisitorType("people");
              setSelectedCompany(null);
              setSelectedVisitor(null);
            }}
          >
            <Icon
              name='UserGroup'
              className={`${visitorType === "people" ? "text-primary " : " title-1"}  w-20 h-20`}
            />
            <p
              className={`${
                visitorType === "people" ? "text-primary font-bold" : " title-1"
              } text-12 `}
            >
              People
            </p>
            <p
              className={`${
                visitorType === "people" ? "bg-blue-600" : "bg-gray-500"
              } px-6 text-white  rounded-full text-12`}
            >
              {peopleVisitorList?.length ?? 0}
            </p>
          </div>
        </div>
        <div className='flex items-center gap-10 text-transparent'>
          <Popover className='relative z-40 flex '>
            <Popover.Button
              className='outline-none'
              onClick={() => setPopoverOpen((prev) => !prev)}
            >
              <div className='flex items-center gap-2 px-4'>
                <Icon
                  name='Calendar'
                  className='w-18 h-18 text-neutral-900 dark:text-neutral-300'
                />
                <p className='px-4 font-medium text-14 text-primary whitespace-nowrap w-82 text-start'>
                  {visitorType === "company"
                    ? timeFilterList?.find((item) => item.value === companyTime).label
                    : ""}
                  {visitorType === "people"
                    ? timeFilterList?.find((item) => item.value === peopleTime).label
                    : ""}
                </p>
                <Icon
                  name={popoverOpen ? "ChevronUp" : "ChevronDown"}
                  className='transition-all duration-75 title-1 w-18 h-18'
                />
              </div>
            </Popover.Button>
            <Transition
              show={popoverOpen}
              className='absolute left-0 w-full top-30'
              enter='transition duration-100 ease-out'
              enterFrom='transform scale-95 opacity-0'
              enterTo='transform scale-100 opacity-100'
              leave='transition duration-75 ease-out'
              leaveFrom='transform scale-100 opacity-100'
              leaveTo='transform scale-95 opacity-0'
            >
              <Popover.Panel className='z-50 w-full p-2 border rounded-md shadow-xl select-none bg-contentColor dark:bg-contentColor-dark border-borderColor dark:border-borderColor-dark '>
                <div ref={ref} className='flex flex-col w-full gap-4'>
                  {timeFilterList.map((item) => (
                    <div
                      key={item.value}
                      className={`flex justify-center w-full px-10 py-6 rounded-md cursor-pointer text-14 whitespace-nowrap hover:bg-hoverColor hover:dark:bg-hoverColor-dark title-2 hover:title-1  ${
                        visitorType === "company" && companyTime === item.value
                          ? "!bg-hoverColor2 dark:!bg-hoverColor-dark-2 dark:!text-primary !text-primary"
                          : ""
                      } ${
                        visitorType === "people" && peopleTime === item.value
                          ? "!bg-hoverColor2 dark:!bg-hoverColor-dark-2 dark:!text-primary !text-primary"
                          : ""
                      }`}
                      onClick={() => {
                        if (visitorType === "company") {
                          setCompanyTime(item.value);
                          setPopoverOpen(false);
                        }
                        if (visitorType === "people") {
                          setPeopleTime(item.value);
                          setPopoverOpen(false);
                        }
                      }}
                    >
                      {item.label}
                    </div>
                  ))}
                </div>
              </Popover.Panel>
            </Transition>
          </Popover>
          {/* <Icon name='Search' />
          <Icon name='Download2' />
          <Icon name='Sort' />
          <p className='text-14'>Quality</p> */}
        </div>
      </div>
      <div className='flex flex-col gap-6 bg-gray-200 py-6 pl-6 dark:bg-borderColor-dark h-[calc(100vh-240px)] overflow-auto scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-600'>
        {visitorType === "people" ? (
          peopleLoading ? null : peopleVisitorList?.length > 0 ? (
            <InfiniteScroll
              className='flex flex-col w-full gap-4 overflow-auto scrollbar-thin dark:scrollbar-thumb-neutral-800'
              dataLength={peopleVisitorList?.length ?? 0}
              next={() => {
                handleGetMorePeople();
              }}
              endMessage={
                <div className='flex justify-center w-full'>
                  {peopleVisitorList?.length > 30 ? (
                    <p className='py-6 text-primary text-13'>- The End -</p>
                  ) : null}
                </div>
              }
              hasMore={hashMorePeople}
              height={window.innerHeight - 255}
              loader={
                <div className='flex justify-center py-2'>
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
              {peopleVisitorList?.map((item, index) => (
                <PeopleRenderItem
                  item={item}
                  key={index}
                  setSelectedCompany={setSelectedCompany}
                  selectedVisitor={selectedVisitor}
                  setSelectedVisitor={setSelectedVisitor}
                />
              ))}
            </InfiniteScroll>
          ) : (
            <div className='flex items-center justify-center h-full'>
              <p className='title-1'>No people visitor.</p>
            </div>
          )
        ) : null}

        {visitorType === "company" ? (
          companyLoading ? null : companyVisitorList?.length > 0 ? (
            <InfiniteScroll
              className='flex flex-col w-full gap-4 overflow-auto scrollbar-thin dark:scrollbar-thumb-neutral-800'
              dataLength={companyVisitorList?.length ?? 0}
              next={() => {
                handleGetMoreCompany();
              }}
              endMessage={
                <div className='flex justify-center w-full'>
                  {companyVisitorList?.length > 30 ? (
                    <p className='py-6 text-primary text-13'>- The End -</p>
                  ) : null}
                </div>
              }
              hasMore={hashMoreCompany}
              height={window.innerHeight - 255}
              loader={
                <div className='flex justify-center py-2'>
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
              {companyVisitorList?.map((item, index) => (
                <CompanyRenderItem
                  item={item}
                  key={index}
                  selectedCompany={selectedCompany}
                  setSelectedCompany={setSelectedCompany}
                  setSelectedVisitor={setSelectedVisitor}
                />
              ))}
            </InfiniteScroll>
          ) : (
            <div className='flex items-center justify-center h-full'>
              <p className='title-1'>No company visitor.</p>
            </div>
          )
        ) : null}

        {(visitorType === "people" ? peopleLoading : companyLoading)
          ? [...new Array(10).keys()]?.map((item) => (
              <div
                key={item}
                className='flex items-center justify-between gap-6 p-6 bg-contentColor dark:bg-contentColor-dark'
              >
                <div className='flex items-center gap-6'>
                  <Skeleton count={1} width={40} height={50} />
                  <div className='flex flex-col gap-4 py-2 pl-4'>
                    <Skeleton count={1} width={270} height={20} />
                    <Skeleton count={1} width={270} height={20} />
                  </div>
                </div>
                <div className='flex items-start h-full'></div>
              </div>
            ))
          : null}
      </div>
    </div>
  );
};

export default ListPanel;
