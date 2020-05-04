import moment from "moment";
import formatDateAndTime from "./formatDateAndTime";

const yearsInFuture = 3;
const secondsForAPIDelay = 60;

export default (time) => {
  // allow for server side delay in network request
  let currentMomentServerSide = new moment();
  currentMomentServerSide.subtract(secondsForAPIDelay, "seconds");

  let futureTimeLimit = new moment();
  futureTimeLimit.add(yearsInFuture, "years");

  let isValid = true;
  let errorMessage = "";

  let validMoment = moment(time);
  if (!validMoment.isValid()) {
    errorMessage = "Please enter a valid date and time";
    isValid = false;
  } else {
    if (!validMoment.isAfter(currentMomentServerSide)) {
      errorMessage = "Please enter a time in the future";
      isValid = false;
    }

    if (!validMoment.isBefore(futureTimeLimit)) {
      errorMessage = "Please enter a time within the next three years";
      isValid = false;
    }
  }

  return { isValid, errorMessage };
};
