import React, { useMemo, useState } from "react";
import ReactLoading from "react-loading";
import { convert } from "html-to-text";
import { differenceInDays, differenceInYears, format, isYesterday, startOfDay } from "date-fns";
import { toast } from "react-toastify";

import Icon from "src/components/base/Icon";
import PopoverButton from "src/components/base/PopoverButton";
import ReactAvatar from "src/components/modules/Avatar";
import { inboxApi } from "src/api/inbox";

type Props = {
  active: boolean;
  avatar: string;
  handleRemove?: Function;
  id: number;
  message: string;
  messageType: string;
  name: string;
  onClick: Function;
  timestamp: string;
};

const InBoxItem: React.FC<Props> = ({
  avatar,
  name,
  message,
  timestamp,
  active,
  onClick,
  messageType,
  id,
  handleRemove = () => {},
}) => {
  const [isSnoozeLoading, setIsSnoozeLoading] = useState(false);
  const [isDismissLoading, setIsDismissLoading] = useState(false);

  const isDateYesterday = useMemo(
    () =>
      timestamp
        ? isYesterday(startOfDay(new Date(timestamp)))
        : isYesterday(startOfDay(new Date())),
    [timestamp]
  );

  const timeFormat = useMemo(() => {
    const diffInDays = timestamp
      ? differenceInDays(startOfDay(new Date()), startOfDay(new Date(timestamp)))
      : 0;
    const diffInYears = timestamp
      ? differenceInYears(startOfDay(new Date()), startOfDay(new Date(timestamp)))
      : 0;
    if (diffInDays <= 1) {
      return "h:mm a";
    }
    if (diffInDays > 1 && diffInDays <= 7) {
      return "EEE h:mm a";
    }
    if (diffInDays > 7 && diffInYears < 1) {
      return "MMM d h:mm a";
    }
    if (diffInYears >= 1) {
      return "YYY MMM dd h:mm a";
    }
  }, [timestamp]) as string;

  const handleSnooze = async () => {
    setIsSnoozeLoading(true);
    try {
      await inboxApi.inboxSnooze(id);
      handleRemove(id);
      toast.success("Snooze message successfully!");
    } catch (error) {
      toast.error(error?.response?.data?.error ?? error?.message);
      console.error("error: ", error);
    }
    setIsSnoozeLoading(false);
  };

  const handleDismiss = async () => {
    setIsDismissLoading(true);
    try {
      await inboxApi.inboxDismiss(id);
      handleRemove(id);
      toast.success("Message dismissed successfully!");
    } catch (error) {
      toast.error(error?.response?.data?.error ?? error?.message);
      console.error("error: ", error);
    }
    setIsDismissLoading(false);
  };

  return (
    <div
      className={`flex px-16 cursor-pointer w-full py-12 transition-all duration-100 my-1 ${
        active
          ? "bg-hoverColor2 dark:bg-hoverColor-dark"
          : "hover:bg-hoverColor dark:hover:bg-hoverColor-dark-2"
      }`}
      onClick={() => onClick()}
    >
      <div className='flex items-center justify-between w-full'>
        <div className='flex items-center gap-10'>
          <ReactAvatar
            src={avatar ?? ""}
            size='50'
            className='rounded-lg'
            name={name?.replace(/^(\w)\w*\s(\w)\w*.*$/, "$1 $2")}
          />
          <div className='flex flex-col justify-center gap-2 pl-6 w-150'>
            <p className='text-12 text-neutral-800 dark:text-neutral-300'>{name}</p>
            <p className='truncate text-11 text-neutral-700 dark:text-neutral-400'>
              {convert(message)}
            </p>
            <p className='text-10 text-neutral-700 dark:text-neutral-400 whitespace-nowrap'>
              {isDateYesterday ? "Yesterday" : ""}{" "}
              {timestamp ? format(new Date(timestamp), timeFormat) : format(new Date(), timeFormat)}
            </p>
          </div>
        </div>
        <div className='flex flex-col justify-between h-full'>
          <div className='flex items-end justify-end'>
            {messageType === "linkedin" ? (
              <Icon name='LinkedIn' className='bg-white rounded-full w-18 h-18' />
            ) : (
              <Icon
                name='MessageBox'
                className='w-20 h-20 p-2 text-white bg-yellow-600 rounded-full'
              />
            )}
          </div>
          <PopoverButton
            className='p-6'
            button={
              <Icon
                className='p-2 transition-all duration-100 border rounded-md w-18 h-18 title-1 hover:text-white border-primary/50 hover:bg-primary'
                name='ChevronDown'
              />
            }
          >
            <div className='flex flex-col items-start gap-4 text-14 min-w-135'>
              <button
                onClick={() => handleDismiss()}
                className='flex justify-center w-full px-10 py-6 rounded-md whitespace-nowrap hover:bg-hoverColor hover:dark:bg-hoverColor-dark title-2 hover:title-1'
              >
                {isDismissLoading ? (
                  <ReactLoading type='bars' width={24} height={21} color='#2285E1' />
                ) : (
                  "Dismiss"
                )}
              </button>
              <button
                onClick={() => handleSnooze()}
                className='flex justify-center w-full px-10 py-6 rounded-md whitespace-nowrap hover:bg-hoverColor hover:dark:bg-hoverColor-dark title-2 hover:title-1'
              >
                {isSnoozeLoading ? (
                  <ReactLoading type='bars' width={24} height={21} color='#2285E1' />
                ) : (
                  "Snooze (24 hours)"
                )}
              </button>
            </div>
          </PopoverButton>
        </div>
      </div>
    </div>
  );
};

export default InBoxItem;
