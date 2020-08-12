import moment from "moment";

const formatDateAndTime = (time, timeFormat = "h:mma") =>
  moment(time).format(`D MMMM YYYY, ${timeFormat}`);

export default formatDateAndTime;
