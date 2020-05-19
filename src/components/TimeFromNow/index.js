import { useEffect, useState } from "react";
import moment from "moment";

const oneMinute = 6000;

const TimeFromNow = ({ dateAndTime, intervalTime = oneMinute }) => {
  const [timeFromNow, setTimeFromNow] = useState(moment(dateAndTime).fromNow());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeFromNow(moment(dateAndTime).fromNow());
    }, intervalTime);
    return () => clearInterval(interval);
  }, []);

  return timeFromNow;
};

export default TimeFromNow;
