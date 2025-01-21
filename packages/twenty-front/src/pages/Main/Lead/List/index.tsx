import React, { useEffect, useMemo, useState } from "react";
import { MoonLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import Avatar from "react-avatar";

import Icon from "src/components/base/Icon";
import TableEmpty from "src/components/base/TableEmpty";
import TableSkeleton from "src/components/base/TableSkeleton";
import Toolbar from "./Toolbar";
import Tooltip from "src/components/base/Tooltip";
import { IProspect } from "src/utils/types/leads";
import { authSelector } from "src/store/Auth";
import { getProspectsList, leadSelector } from "src/store/Leads";
import { paths } from "src/routes/path";
import { useAppDispatch, useAppSelector } from "src/hook/redux/useStore";

const LeadPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { isProspectListPending, prospectList, grandTotalLeads } = useAppSelector(leadSelector);
  const { userInfo } = useAppSelector(authSelector);

  const handleNavigate = (id: string, avatar: string) => {
    navigate(`${paths.main.lead.index}/${id}`, { state: { avatar } });
  };

  const [selectedLeadId, setSelectedLeadId] = useState<string[]>([]);

  const selectedProspects = useMemo(
    () => prospectList.filter((item) => selectedLeadId.includes(item.id)),
    [selectedLeadId]
  );

  const [isLoading, setIsLoading] = useState(false);
  const [currentBlock, setCurrentBlock] = useState(0);
  const [reachedBottom, setReachedBottom] = useState(false);

  const [filter, setFilter] = useState<string>("");

  const tableColumn = [
    {
      id: "checkbox",
      label: "Checkbox",
      width: "w-70",
      headerRender: () => (
        <div className='pt-4'>
          <input
            type='checkbox'
            onChange={(event) => {
              if (event.target.checked && prospectList) {
                setSelectedLeadId(prospectList.map((item) => item?.id));
              } else {
                setSelectedLeadId([]);
              }
            }}
            checked={
              selectedLeadId?.length === prospectList.length &&
              !isLoading &&
              prospectList.length > 0
            }
            className={`accent-primary border-2 dark:border-primary border-neutral-600 rounded cursor-pointer outline-none w-16 h-16 ${
              selectedLeadId?.length === prospectList.length && !isLoading ? "" : "appearance-none"
            }`}
          />
        </div>
      ),
      render: (row: IProspect) => (
        <div className='pt-4'>
          <input
            onChange={(event) => {
              if (event.target.checked) {
                setSelectedLeadId((prev) => [...prev, row?.id]);
              } else {
                const newIds = [...selectedLeadId]?.filter((item) => item !== row?.id);
                setSelectedLeadId(newIds);
              }
            }}
            checked={selectedLeadId?.includes(row?.id)}
            type='checkbox'
            className={`accent-primary border-2 dark:border-primary border-neutral-600 group-hover:border-white group-hover:dark:border-primary rounded cursor-pointer outline-none w-16 h-16 ${
              selectedLeadId?.includes(row?.id) ? "" : "appearance-none"
            }`}
          />
        </div>
      ),
    },
    {
      id: "contact",
      label: "Contact",
      render: (row: IProspect) => (
        <div className='flex items-center gap-8 pr-4'>
          <Avatar
            src={row?.image_url}
            name={row?.name.replace(/^(\w)\w*\s(\w)\w*.*$/, "$1 $2")}
            size='36'
            className='flex-none rounded-sm'
          />
          <Tooltip label={`${row?.first_name} ${row?.last_name}`}>
            <p
              onClick={() => handleNavigate(row?.id, row?.image_url ?? "")}
              className='truncate cursor-pointer text-14 max-w-150'
            >{`${row?.first_name} ${row?.last_name}`}</p>
          </Tooltip>
        </div>
      ),
    },
    {
      id: "company",
      label: "Company",
      width: "w-270",
      render: (row: IProspect) => (
        <div className='flex items-center gap-8'>
          {row?.company?.company_logo ? (
            <img src={row?.company?.company_logo} className='w-20 h-20' alt='avatar' />
          ) : (
            <Icon name='Company' className='w-30 h-30' />
          )}
          <Tooltip label={row?.company?.name}>
            <p className='truncate text-14 max-w-150'>{row?.company?.name}</p>
          </Tooltip>
        </div>
      ),
    },
    {
      id: "title",
      label: "Position",
      width: "w-270",
      render: (row: IProspect) => (
        <Tooltip label={row?.company?.position}>
          <p className='truncate text-14 max-w-200'>{row?.company?.position}</p>
        </Tooltip>
      ),
    },
    {
      id: "phone",
      label: "Phone",
      width: "w-270",
      text: "text-primary",
      render: (row: IProspect) => (
        <Tooltip label={row?.phones?.map((item) => item?.phone)?.join(",")}>
          <p className='truncate text-14 max-w-300'>
            {row?.phones?.map((item) => item?.phone)?.join(",")}
          </p>
        </Tooltip>
      ),
    },
    {
      id: "email",
      label: "Email",
      width: "w-270",
      text: "text-primary",
      render: (row: IProspect) => (
        <div className='flex gap-4'>
          {row?.emails?.map((item) => (
            <Tooltip key={item?.email} label={item?.email}>
              <p
                className={`${item.is_verified ? "text-success-1" : ""} text-14 truncate max-w-150`}
              >
                {item.email}
              </p>
            </Tooltip>
          ))}
        </div>
      ),
    },
    {
      id: "location",
      label: "Location",
      width: "w-270",
      render: (row: IProspect) => (
        <Tooltip label={row?.locations[0]?.address_string}>
          <p className='truncate max-w-200'>{row?.locations[0]?.address_string}</p>
        </Tooltip>
      ),
    },
    {
      id: "industry",
      label: "Industry",
      width: "w-270",
    },
    {
      id: "action",
      label: "ACTIONS",
      width: "w-170",
      render: (row: IProspect) => (
        <div className='flex items-center justify-between gap-5 text-primary'>
          <p
            className='cursor-pointer group-hover:text-white'
            onClick={() => handleNavigate(row?.id, row?.image_url ?? "")}
          >
            CRM
          </p>
        </div>
      ),
    },
  ];

  const handleGetProspects = async () => {
    setIsLoading(true);
    const req = {
      limit: 100,
      offset: currentBlock,
      order: "desc",
      query: !!filter.length ? filter : `@user_id in ${userInfo?.id}`,
      sort: "created_at",
    };
    await dispatch(getProspectsList(req));
    setIsLoading(false);
  };

  const handleeMoreGet = async () => {
    const req = {
      limit: 1000,
      offset: currentBlock + 1,
      order: "desc",
      query: !!filter.length ? filter : `@user_id in ${userInfo?.id}`,
      sort: "created_at",
    };
    await dispatch(getProspectsList(req));
    setCurrentBlock((prev) => prev + 1);
  };

  useEffect(() => {
    const element = document.getElementById("scroll-element") as HTMLElement;

    const handleScroll = () => {
      const isBottom = element.scrollTop + element.clientHeight >= element.scrollHeight;
      if (isBottom) {
        setReachedBottom(true);
      } else {
        setReachedBottom(false);
      }
    };
    element.addEventListener("scroll", handleScroll);
    return () => {
      element.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (reachedBottom && prospectList?.length < grandTotalLeads) {
      handleeMoreGet();
    }
    // while (prospectList?.length < grandTotalLeads) {
    //   handleeMoreGet();
    //   new Promise((resolve) => setTimeout(resolve, 1000));
    // }
  }, [reachedBottom, filter]);

  useEffect(() => {
    handleGetProspects();
  }, [filter]);

  useEffect(() => {
    console.log("selectedProspects: ", selectedLeadId);
  }, [selectedLeadId]);

  return (
    <>
      <Toolbar
        filter={filter}
        setFilter={(val: string) => setFilter(val)}
        userId={userInfo?.id}
        selectedProspects={selectedProspects}
        totalLeads={prospectList?.length}
        grandTotalLeads={grandTotalLeads}
      />
      <div
        id='scroll-element'
        className='w-full h-[calc(100vh-220px)] scrollbar-thin overflow-auto dark:scrollbar-thumb-neutral-700 scrollbar-thumb-neutral-300 border-borderColor dark:border-borderColor-dark relative border bg-contentColor dark:bg-contentColor-dark'
      >
        <table className='z-10 w-full text-neutral-800 dark:text-neutral-300 '>
          <thead className='sticky top-0 z-20 w-full'>
            <tr className='z-40 bg-contentColor dark:bg-contentColor-dark'>
              {tableColumn.map((item) => (
                <td
                  key={item.id}
                  className={`px-20 font-medium uppercase text-left py-14 text-14 ${item.width}`}
                >
                  {item.headerRender ? item.headerRender() : item.label}
                </td>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading && prospectList.length == 0 ? (
              <TableSkeleton rowCount={15} cellCount={9} />
            ) : (
              prospectList?.map((socialItem: any, socialIndex: number) => (
                <tr
                  key={socialIndex}
                  className='transition-all duration-100 hover:bg-primary-2 dark:hover:bg-primary-5 group'
                >
                  {tableColumn.map((item) => (
                    <td
                      key={item?.id}
                      className={`px-20 font-normal group-hover:text-white py-14 text-14 whitespace-nowrap ${item?.text}`}
                    >
                      {item?.render ? item.render(socialItem) : socialItem[item?.id]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
          {!prospectList?.length && !isLoading && <TableEmpty height='h-[calc(100vh-280px)]' />}
        </table>
      </div>
      <div className='pt-20'>
        {isProspectListPending ? (
          <div className='flex justify-center w-full'>
            <MoonLoader color='#2285E1' size={25} />
          </div>
        ) : (
          <p className='text-center text-neutral-800 dark:text-neutral-300'>{`Contacts: ${prospectList.length}`}</p>
        )}
      </div>
    </>
  );
};

export default LeadPage;
