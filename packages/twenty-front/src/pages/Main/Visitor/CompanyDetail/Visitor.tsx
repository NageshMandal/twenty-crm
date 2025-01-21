import React, { useMemo, useState } from "react";
import { PiUserCircleFill } from "react-icons/pi";
import { format } from "date-fns";
import { IVisitor } from "src/utils/types/visitor";
import { getVisitDuration } from "src/utils/functions";
import classNames from "classnames";

type Props = {
  visitor: IVisitor;
  index: number;
};

const Visitor: React.FC<Props> = ({ visitor, index }) => {
  const [showAllPages, setShowAllPages] = useState(false);

  const sessions = useMemo(() => {
    if (visitor) {
      const result = visitor.sessions.sort((a, b) => {
        const targetA = new Date(a.created_at);
        const targetB = new Date(b.created_at);
        return targetB.getTime() - targetA.getTime();
      });
      return result;
    }
  }, [visitor]);

  return sessions ? (
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
            <p className='flex-auto font-medium leading-5 text-15 title-1'>
              Anonymous Visitor {index + 1}
            </p>
            <p className='flex-none py-0.5 text-14 leading-5 title-2'>
              Visits {sessions?.length} - {sessions[0].location && sessions[0].location + ","}{" "}
              {getVisitDuration(visitor?.time)}
            </p>
          </div>
        </div>
      </li>
      {!showAllPages ? (
        <li className='relative flex gap-x-4'>
          <div
            className={classNames(
              sessions?.length >= 2 ? "-bottom-5" : "h-5",
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
                {format(new Date(sessions[0]?.created_at), "dd MMM yyyy - HH:mm")}
              </p>
              <a
                className='flex-none py-0.5 text-14 leading-5 title-2'
                href={
                  sessions[0]?.pages
                    ? sessions[0]?.pages[0].url
                    : sessions[0]?.referrer
                    ? sessions[0]?.referrer
                    : "#"
                }
                target='_blank'
                style={{ color: "#2285E1" }}
              >
                {sessions[0]?.pages
                  ? sessions[0]?.pages[0].url
                  : sessions[0]?.referrer
                  ? sessions[0]?.referrer
                  : "#"}
              </a>
            </div>
          </div>
        </li>
      ) : null}
      {showAllPages
        ? sessions.map((session) => (
            <li className='relative flex gap-x-4' key={session.tracking_id}>
              <div
                className={classNames(
                  sessions?.length > 2 ? "-bottom-5" : "h-5",
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
          ))
        : null}
      {sessions?.length > 1 ? (
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
                {showAllPages ? "Hide sessions" : `View all ${sessions?.length} sessions`}
              </p>
            </div>
          </div>
        </li>
      ) : null}
    </ul>
  ) : null;
};

export default Visitor;
