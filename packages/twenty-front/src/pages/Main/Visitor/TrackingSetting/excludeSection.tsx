import React, { useMemo, useState } from "react";
import { BsTrash3 } from "react-icons/bs";

import Button from "src/components/base/Button";
import Input from "src/components/base/Input";
import { handleUpdateAccount, visitorSelector } from "src/store/Vistor";
import { useAppDispatch, useAppSelector } from "src/hook/redux/useStore";

const ExcludeSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const { includes, excludes, domain, isAccountPending } = useAppSelector(visitorSelector);

  const [currentTab, setCurrentTab] = useState<string>("domains");

  const showInfo = useMemo(() => {
    if (excludes && currentTab) {
      switch (currentTab) {
        case "domains":
          return {
            target: "domains",
            title: "Exclude the following Domains from tracking on website",
            list: excludes.domains,
          };
        case "ips":
          return {
            target: "ips",
            title: "Exclude the following IPs from tracking on website",
            list: excludes.ips,
          };
        case "pages":
          return {
            target: "pages",
            title: "Exclude the following Pages from tracking on website",
            list: excludes.pages,
          };
      }
    }
  }, [excludes, currentTab]);

  const [webSite, setWebSite] = useState<string>("");

  const handleUpdateIncludes = async (target?: string, val?: string) => {
    try {
      if (val) {
        const updateExcludes = { ...excludes };
        switch (target) {
          case "domains":
            updateExcludes.domains = [...updateExcludes.domains?.filter((item) => item !== val)];
            break;
          case "ips":
            updateExcludes.ips = [...updateExcludes.ips?.filter((item) => item !== val)];
            break;
          case "targets":
            updateExcludes.pages = [...updateExcludes.pages?.filter((item) => item !== val)];
            break;
        }

        await dispatch(
          handleUpdateAccount({
            includes,
            origins: [domain],
            excludes: updateExcludes,
          })
        );
      } else {
        const updateExcludes = { ...excludes };
        switch (target) {
          case "domains":
            updateExcludes.domains = [...updateExcludes.domains, webSite];
            break;
          case "ips":
            updateExcludes.ips = [...updateExcludes.ips, webSite];
            break;
          case "pages":
            updateExcludes.pages = [...updateExcludes.pages, webSite];
            break;
        }
        await dispatch(
          handleUpdateAccount({ includes, origins: [domain], excludes: updateExcludes })
        );
      }
      setWebSite("");
    } catch (error) {
      console.error("error: ", error);
    }
  };
  return (
    <div className='px-32 pt-32 w-1000'>
      <h2 className='font-normal select-none pb-18 text-20 text-neutral-900 dark:text-neutral-300'>
        Exclude from Tracking
      </h2>
      <div className='grid grid-cols-3'>
        {[
          { label: "Domains", value: "domains" },
          { label: "Ips", value: "ips" },
          { label: "Pages", value: "pages" },
        ].map((item) => (
          <p
            key={item.value}
            className={`title-1 text-center pb-6 border-b-2 cursor-pointer  ${
              item.value === currentTab
                ? "border-primary dark:border-primary"
                : "border-borderColor dark:border-borderColor-dark"
            }`}
            onClick={() => setCurrentTab(item.value)}
          >
            {item.label}
          </p>
        ))}
      </div>
      {showInfo ? (
        <div className='flex flex-col pt-16'>
          <p className='py-10 pb-20 title-1 text-16'>{showInfo.title}</p>
          <div className='flex pb-12 pr-6 flex-col h-[calc(100vh-400px)] overflow-auto scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-600'>
            {showInfo.list.map((item, index) => (
              <div
                key={index}
                className='flex items-center justify-between px-16 py-10 mb-6 shadow-md bg-contentColor dark:bg-contentColor-dark'
              >
                <p className='title-1'>{item}</p>
                <BsTrash3
                  className='flex-none w-20 h-20 cursor-pointer title-2 hover:title-1'
                  onClick={() => handleUpdateIncludes(showInfo.target, item)}
                />
              </div>
            ))}
          </div>
          <div className='flex items-center justify-between w-full gap-10 p-12 shadow-md'>
            <Input
              placeholder='Add Page'
              divClassName='w-full'
              value={webSite}
              onChange={(event) => setWebSite(event?.target?.value)}
            />
            <Button
              isPending={isAccountPending}
              className='w-100'
              disabled={!webSite.length}
              onClick={() => handleUpdateIncludes(showInfo.target)}
            >
              Add
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ExcludeSection;
