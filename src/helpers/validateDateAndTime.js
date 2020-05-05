import moment from "moment";

const yearsInFuture = 3;
const secondsForAPIDelay = 60;

export default (dateTime) => {
  // allow for server side delay in network request
  let currentMomentServerSide = new moment();
  currentMomentServerSide.subtract(secondsForAPIDelay, "seconds");

  let futureTimeLimit = new moment();
  futureTimeLimit.add(yearsInFuture, "years");

  let errorMessage = "";
  let isValidTime = true;
  let isValidDate = true;

  let validMoment = moment(dateTime);
  if (!validMoment.isValid()) {
    if (validMoment.invalidAt() > 2) {
      errorMessage = "Please enter a valid time";
      isValidTime = false;
    } else {
      errorMessage = "Please enter a valid date";
      isValidDate = false;
    }
  } else {
    if (!validMoment.isAfter(currentMomentServerSide)) {
      errorMessage = "Please enter a time in the future";
      isValidTime = false;
    }

    if (!validMoment.isBefore(futureTimeLimit)) {
      errorMessage = "Please enter a time within the next three years";
      isValidDate = false;
    }
  }

  return { isValidTime, isValidDate, errorMessage };
};
