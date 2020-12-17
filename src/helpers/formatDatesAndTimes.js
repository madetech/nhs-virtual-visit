import moment from "moment";

export const formatDate = (time) => moment(time).format("D MMMM YYYY");

export const formatTime = (time, timeFormat = "h:mma") =>
  moment(time).format(timeFormat);

export const formatDateAndTime = (time, timeFormat = "h:mma") =>
  moment(time).format(`D MMMM YYYY, ${timeFormat}`);

  export default formatDate;