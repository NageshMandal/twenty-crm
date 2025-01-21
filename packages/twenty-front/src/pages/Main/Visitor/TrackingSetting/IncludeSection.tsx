import React, { useState } from "react";
import { BsTrash3 } from "react-icons/bs";
import Button from "src/components/base/Button";
import Input from "src/components/base/Input";
import { useAppDispatch, useAppSelector } from "src/hook/redux/useStore";
import { handleUpdateAccount, visitorSelector } from "src/store/Vistor";

const IncludeSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const { includes, excludes, domain, isAccountPending } = useAppSelector(visitorSelector);
  const [webSite, setWebSite] = useState<string>("");

  const handleUpdateIncludes = async (val?: any) => {
    try {
      if (val) {
        await dispatch(
          handleUpdateAccount({
            includes: [...includes.filter((item) => item !== val)],
            origins: [domain],
            excludes,
          })
        );
      } else {
        await dispatch(
          handleUpdateAccount({ includes: [...includes, [webSite]], origins: [domain], excludes })
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
        Track only the following pages on website
      </h2>
      <div className='flex flex-col pt-16'>
        <div className='flex pb-12 pr-6 flex-col h-[calc(100vh-310px)] overflow-auto scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-600'>
          {includes
            ? includes?.map((item, index) => (
                <div
                  key={index}
                  className='flex py-10 px-16 mb-6 shadow-md items-center justify-between bg-contentColor dark:bg-contentColor-dark'
                >
                  <p className='title-1'>{item[0]}</p>
                  <BsTrash3
                    className='title-2 w-20 h-20 flex-none cursor-pointer hover:title-1'
                    onClick={() => handleUpdateIncludes(item)}
                  />
                </div>
              ))
            : null}
        </div>
        <div className='flex gap-10 w-full items-center justify-between p-12 shadow-md'>
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
            onClick={() => handleUpdateIncludes()}
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IncludeSection;
