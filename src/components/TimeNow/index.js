import { useEffect, useState } from "react";
import moment from "moment";

const oneSecond = 1000;

const TimeNow = () => {
  const [timeNow, setTimeNow] = useState(moment().format("HH:mm"));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeNow(moment().format("HH:mm"));
    }, oneSecond);
    return () => clearInterval(interval);
  }, []);

  return timeNow;
};

export default TimeNow;
