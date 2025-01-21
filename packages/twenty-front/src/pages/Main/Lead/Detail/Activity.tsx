import React, { useEffect, useMemo } from "react";

import Icon from "src/components/base/Icon";
import { IActivity, ISortedAutomationActivity } from "src/utils/types/leads";
import { useAppDispatch, useAppSelector } from "src/hook/redux/useStore";
import { getAutomationActivity, leadSelector } from "src/store/Leads";

type Props = {
  activities?: string[];
  prospectId: string;
};

const Activity: React.FC<Props> = ({ activities, prospectId }) => {
  const dispatch = useAppDispatch();
  const { automationActivities } = useAppSelector(leadSelector);

  const activityList = useMemo(() => {
    const result = activities
      ?.map((activity) => JSON.parse(activity))
      ?.map((item: IActivity, index) => ({
        id: index,
        created: item.created,
        text: item.text
          ?.replace(/[,\<<>>]/g, "")
          ?.replace("[prospects:x]", "")
          ?.replace("[user]", "You"),
        prospect: item.x[prospectId],
        type: item.type,
      }));
    return result;
  }, [activities]);

  const getColorStatus = (status: string) => {
    switch (status) {
      case "error":
        return "red";
      case "success":
        return "green";
      case "null":
        return "yellow";
      default:
        return "black";
    }
  };

  const showMessage = (label: string, info: string, activity: ISortedAutomationActivity) => {
    return (
      <div className='flex'>
        <p className='font-normal text-14 text-neutral-800 dark:text-neutral-300'>{label}</p>
        <div className='flex gap-16 text-14'>
          <p className='text-neutral-800 dark:text-neutral-300'>{info}</p>
          <p className='text-neutral-800 dark:text-neutral-300'>
            Status:{" "}
            <span style={{ color: getColorStatus(activity.status) }}>
              {activity.status?.replace(/^./, activity.status[0].toUpperCase())}
            </span>
          </p>
        </div>
      </div>
    );
  };

  const getLabel = (action: string, activity: ISortedAutomationActivity) => {
    let label = "";
    let info = "";
    switch (action) {
      case "send-message":
        label = "You sent a message";
        info = activity.data.message;
        break;
      case "connect-contacts":
        label = "You sent a connection request";
        info = "";
        break;
      case "email":
        label = "You sent an email";
        info = activity.data.subject;
        break;
      case "auto-endorse":
        label = "You endorsed with";
        info = `proficiency ${activity.data.proficiency} and relationship ${activity.data.relationship}`;
        break;
      case "auto-visit":
        label = "You auto visited";
        info = "";
        break;
      case "added-by-automation":
        label = "";
        info = activity.data.message;
        break;
    }
    return showMessage(label, info, activity);
  };

  const getAutomationActivities = async () => {
    await dispatch(getAutomationActivity(prospectId));
  };

  const sortedAutomationActivities = useMemo(() => {
    if (automationActivities) {
      const result = automationActivities.map((item) => ({
        ...item,
        data: JSON.parse(item.data),
      })) as unknown as ISortedAutomationActivity[];
      return result;
    }
  }, [automationActivities]);

  useEffect(() => {
    if (prospectId) getAutomationActivities();
  }, [prospectId]);

  return (
    <>
      <h2 className='px-4 py-16 font-bold text-16 text-neutral-800 dark:text-neutral-300'>
        Last Activities
      </h2>
      <div className='px-10 border rounded-md py-15 max-w-640 border-borderColor dark:border-borderColor-dark bg-contentColor dark:bg-contentColor-dark'>
        <div className='flex flex-col gap-18'>
          {activityList?.map((item) => (
            <div key={item.id} className='flex items-center gap-10'>
              <div className='p-8 rounded-md bg-primary/10'>
                <Icon name='People' />
              </div>
              <p className='font-normal text-14 text-neutral-800 dark:text-neutral-300'>
                {item.text}
              </p>
              <p className='font-normal text-14 text-sky-700 dark:text-info whitespace-nowrap'>
                {item.prospect}
              </p>
            </div>
          ))}
        </div>
        <h3 className='pt-16 font-medium dark:text-neutral-300 text-neutral-800 pb-7'>
          LATEST AUTOMATION ACTIVITIES
        </h3>
        {sortedAutomationActivities?.map((item) => (
          <div key={item.id}>
            <p className='text-neutral-800 dark:text-neutral-300 pt-7 pb-13'>{item.action}</p>
            <div className='flex items-center gap-16'>
              <div className='p-8 rounded-md bg-primary/10'>
                <Icon name='People' />
              </div>
              {getLabel(item.action, item)}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Activity;
