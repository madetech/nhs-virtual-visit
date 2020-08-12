import moment from "moment";

const formatTime = (time, timeFormat = "h:mma") =>
  moment(time).format(timeFormat);

export default formatTime;
