import React, { useMemo, useState } from "react";
import { PiUserCircleFill } from "react-icons/pi";
import { format } from "date-fns";
import { IVisitorSession } from "src/utils/types/visitor";
import { getVisitDuration } from "src/utils/functions";
import classNames from "classnames";

type Props = {
  session: IVisitorSession;
  name: string;
  index: number;
};

const Session: React.FC<Props> = ({ session, name }) => {
  const [showAllPages, setShowAllPages] = useState(false);

  const visitedTimes = useMemo(() => {
    if (session) {
      let time = 0;
      session.pages.map((i) => (time = time + i.time));
      return time;
    }
  }, [session]);

  return true ? (
    <ul
      role='list'
      className='pt-24 pl-24 space-y-6 border rounded-lg border-borderColor dark:border-borderColor-dark'
    >
      <li className='relative flex gap-x-4'>
        <div className='absolute top-0 left-0 flex justify-center w-6 -bottom-5'>
          <div className='w-px bg-primary' />
        </div>
        <div className='flex'>
          <div className='relative flex items-center justify-center flex-none w-6 h-6 bg-white'>
            <PiUserCircleFill className='flex-none rounded-full w-30 h-30 text-primary dark:bg-bodyBgColor-dark bg-bodyBgColor' />
          </div>
          <div className='flex flex-col pl-16 -mt-24 py-14'>
            <p className='flex-auto font-medium leading-5 text-15 title-1'>{name}</p>
            <p className='flex-none py-0.5 text-14 leading-5 title-2'>
              Visits {session?.pages?.length} -{getVisitDuration(visitedTimes)}
            </p>
          </div>
        </div>
      </li>
      {!showAllPages ? (
        <li className='relative flex gap-x-4'>
          <div
            className={classNames(
              session?.pages?.length >= 2 ? "-bottom-5" : "h-5",
              "absolute left-0 top-0 flex w-6 justify-center"
            )}
          >
            <div className='w-px bg-primary' />
          </div>
          <div className='flex'>
            <div className='relative flex items-center justify-center flex-none w-6 h-6 bg-white'>
              <div className='flex-none w-8 h-8 rounded-full dark:bg-contentColor-dark bg-contentColor ring-2 ring-primary' />
            </div>
            <div className='flex flex-col pl-16 -mt-22 py-14'>
              <p className='flex-auto leading-5 text-14 title-1'>
                {format(new Date(session?.created_at), "dd MMM yyyy - HH:mm")}
              </p>
              <a
                className='flex-none py-0.5 text-14 leading-5 title-2'
                href={
                  session?.pages
                    ? session?.pages[0].url
                    : session?.referrer
                    ? session?.referrer
                    : "#"
                }
                target='_blank'
                style={{ color: "#2285E1" }}
              >
                {session?.pages
                  ? session?.pages[0].url
                  : session?.referrer
                  ? session?.referrer
                  : "#"}
              </a>
            </div>
          </div>
        </li>
      ) : null}
      {showAllPages
        ? session?.pages?.map((page) => (
            <li className='relative flex gap-x-4' key={session.tracking_id}>
              <div
                className={classNames(
                  session?.pages?.length > 2 ? "-bottom-5" : "h-5",
                  "absolute left-0 top-0 flex w-6 justify-center"
                )}
              >
                <div className='w-px bg-primary' />
              </div>
              <div className='flex'>
                <div className='relative flex items-center justify-center flex-none w-6 h-6 bg-white'>
                  <div className='flex-none w-8 h-8 rounded-full dark:bg-contentColor-dark bg-contentColor ring-2 ring-primary' />
                </div>
                <div className='flex flex-col pl-16 -mt-22 py-14'>
                  <p className='flex-auto leading-5 text-14 title-1'>
                    {format(new Date(session?.created_at), "dd MMM yyyy - HH:mm")}
                  </p>
                  <a
                    className='flex-none py-0.5 text-14 leading-5 title-2'
                    href={page.url}
                    target='_blank'
                    style={{ color: "#2285E1" }}
                  >
                    {page.url}
                  </a>
                </div>
              </div>
            </li>
          ))
        : null}
      {session?.pages?.length > 1 ? (
        <li className='relative flex gap-x-4'>
          <div className='absolute top-0 left-0 flex justify-center w-6 h-5'>
            <div className='w-px bg-primary' />
          </div>
          <div className='flex'>
            <div className='relative flex items-center justify-center flex-none w-6 h-6 bg-white'>
              <div className='flex-none w-8 h-8 rounded-full dark:bg-contentColor-dark bg-contentColor ring-2 ring-primary' />
            </div>
            <div
              className='flex flex-col pl-16 cursor-pointer -mt-22 py-14'
              onClick={() => setShowAllPages((prev) => !prev)}
            >
              <p className='flex-auto leading-5 transition-all duration-100 text-14 title-2 hover:title-1'>
                {showAllPages ? "Hide sessions" : `View all ${session?.pages?.length} sessions`}
              </p>
            </div>
          </div>
        </li>
      ) : null}
    </ul>
  ) : null;
};

export default Session;
