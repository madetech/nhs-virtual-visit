import moment from "moment";

export default (time) => {
  // allow for server side delay in network request
  let currentMomentServerSide = new moment();
  currentMomentServerSide.subtract(60, "seconds");

  let futureTimeLimit = new moment();
  futureTimeLimit.add(3, "years");

  let isValid = true;
  let errorMessage = "";

  try {
    moment(time);
    if (!time.isAfter(currentMomentServerSide)) {
      errorMessage = "Please enter a time in the future";
      isValid = false;
    }
    if (!time.isBefore(futureTimeLimit)) {
      errorMessage = "Please enter a time within the next three years";
      isValid = false;
    }
  } catch (error) {
    errorMessage = "Please enter a valid date and time";
    isValid = false;
  }

  return { isValid, errorMessage };
};
