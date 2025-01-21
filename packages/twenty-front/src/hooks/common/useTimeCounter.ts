import { useState, useEffect } from "react";
import { differenceInMinutes, addMinutes } from "date-fns";

export const useTimeCounter = (minutes: number) => {
  const [remainingTime, setRemainingTime] = useState(minutes ?? 0);

  useEffect(() => {
    const startTime = new Date();
    const endTime = addMinutes(startTime, 30);

    const interval = setInterval(() => {
      const currentTime = new Date();
      const timeDifference = differenceInMinutes(endTime, currentTime);
      setRemainingTime(timeDifference);
    }, 60000);

    return () => {
      clearInterval(interval);
    };
  }, []);
  return { remainingTime };
};
