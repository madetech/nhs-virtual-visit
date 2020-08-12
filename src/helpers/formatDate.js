import moment from "moment";

const formatDate = (time) => moment(time).format("D MMMM YYYY");
export default formatDate;
