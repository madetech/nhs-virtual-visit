import moment from "moment";

export default (time, timeFormat = "h:mma") =>
  moment(time).format(`D MMMM YYYY, ${timeFormat}`);
