import validateEmailAddress from "./validateEmailAddress";
import isPresent from "./isPresent";
import validateMobileNumber from "./validateMobileNumber";
import validateDateAndTime from "./validateDateAndTime";

export const validateVisit = ({
  patientName,
  recipientName,
  recipientEmail,
  recipientNumber,
  callTime,
}) => {
  let errors = {};

  if (!isPresent(patientName)) {
    errors.patientName = "patientName must be present";
  }

  if (!isPresent(recipientName)) {
    errors.recipientName = "recipientName must be present";
  }

  if (!isPresent(callTime)) {
    errors.callTime = "callTime must be present";
  } else {
    const { isValidTime, isValidDate, errorMessage } = validateDateAndTime(
      callTime
    );

    if (!isValidTime || !isValidDate) {
      errors.callTime = errorMessage;
    }
  }

  if (!isPresent(recipientNumber) && !isPresent(recipientEmail)) {
    errors.recipientEmail = "recipientNumber or recipientEmail must be present";
    errors.recipientNumber = "recipientNumber or recipientEmail must be present";
  } else {
    if (recipientEmail && !validateEmailAddress(recipientEmail)) {
      errors.recipientEmail = "recipientEmail must be a valid email address";
    }
    if (recipientNumber && !validateMobileNumber(recipientNumber)) {
      errors.recipientNumber = "recipientNumber must be a valid mobile number";
    }
  }

  const hasErrors = Object.keys(errors).length;

  if (hasErrors) {
    return { validVisit: false, errors };
  } else {
    return { validVisit: true, errors: null };
  }
};

export default validateVisit;
