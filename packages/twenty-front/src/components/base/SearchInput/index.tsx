import React, { useEffect, useRef, useState } from "react";
import Avatar from "react-avatar";
import ReactLoading from "react-loading";
import { Popover, Transition } from "@headlessui/react";
import { useNavigate } from "react-router-dom";

import Icon from "../Icon";
import Input from "../Input";
import useDebounce from "../../../hook/common/useDebounce";
import useOutsideClick from "../../../hook/common/useOutsideClick";
import { IProspect } from "../../../utils/types/leads";
import { leadApi } from "../../../api/leads";

const SearchInput: React.FC = () => {
  const ref = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [filteredLead, setFilteredLead] = useState<IProspect[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchQuery = useDebounce(query, 500);

  const [isOpen, setIsOpen] = useState(false);

  useOutsideClick(ref, () => {
    setIsOpen(false);
  });

  const handleClickSearchItem = (type: string, id: string) => {
    if (type === "prospect") {
      navigate(`/lead/${id}`);
    } else {
      console.log("company");
    }
  };

  const handleCustomSearch = async (q: string) => {
    setIsLoading(true);
    setIsOpen(true);
    try {
      const request = {
        q,
        types: ["prospect"],
      };
      const res = (await leadApi.handleCustomSearch(request)) as unknown as IProspect[];
      setFilteredLead(res);
    } catch (error) {
      console.error("error: ", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!!searchQuery.length) {
      handleCustomSearch(searchQuery);
    }
  }, [searchQuery]);

  return (
    <Popover className='relative z-40 flex items-center justify-center'>
      <div className='relative'>
        <Input
          onFocus={() => {
            if (!!filteredLead.length) {
              setIsOpen(true);
            }
          }}
          onClick={(event) => event.stopPropagation()}
          divClassName='w-220 large:w-250'
          placeholder='Search...'
          value={query}
          onKeyDown={(event: any) => {
            if (event.code == "Enter") {
              setQuery(event?.target?.value);
              handleCustomSearch(event?.target?.value);
            }
          }}
          onChange={(event) => setQuery(event?.target?.value)}
        />
        <Icon
          name='Cross'
          className='absolute -translate-y-1/2 w-22 h-22 right-10 text-neutral-700 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-300 top-1/2'
          onClick={(event) => {
            event.stopPropagation();
            setQuery("");
          }}
        />
        <div className='absolute mt-2 -translate-y-1/2 top-1/2 right-30'></div>
      </div>
      <Transition
        className='absolute left-0 top-45'
        show={isOpen}
        enter='transition duration-100 ease-out'
        enterFrom='transform scale-95 opacity-0'
        enterTo='transform scale-100 opacity-100'
        leave='transition duration-75 ease-out'
        leaveFrom='transform scale-100 opacity-100'
        leaveTo='transform scale-95 opacity-0'
      >
        <Popover.Panel className='z-50 py-2 border rounded-md shadow-xl select-none bg-contentColor dark:bg-contentColor-dark border-borderColor dark:border-borderColor-dark '>
          <div
            ref={ref}
            className='flex flex-col gap-4 p-4 overflow-auto w-220 large:w-250 max-h-290 scrollbar-1'
          >
            {isLoading ? (
              <div className='flex items-center justify-center h-150'>
                <ReactLoading className='mt-25' type={"spin"} color='#2285E1' width={40} />
              </div>
            ) : null}
            {!isLoading && !filteredLead?.length && (
              <div className='flex items-center justify-center h-150'>
                <p className='title-1'>No result!</p>
              </div>
            )}

            {!isLoading
              ? filteredLead?.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleClickSearchItem(item.type, item.id)}
                    className='flex items-center justify-between gap-10 px-12 py-10 cursor-pointer hover:bg-hoverColor dark:hover:bg-hoverColor-dark'
                  >
                    <div className='flex items-center gap-10'>
                      <Avatar
                        src={item?.image_url}
                        name={item.name.replace(/^(\w)\w*\s(\w)\w*.*$/, "$1 $2")}
                        size='40'
                        className='flex-none rounded-sm'
                      />
                      <div className=''>
                        <p className='text-neutral-300 text-14'>{item.name}</p>
                      </div>
                    </div>
                    {item.type === "prospect" ? (
                      <Icon
                        name='People'
                        className='flex-none overflow-hidden bg-white rounded-lg w-30 h-30'
                      />
                    ) : (
                      <Icon name='Company' className='flex-none w-30 h-30' />
                    )}
                  </div>
                ))
              : null}
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

export default SearchInput;
