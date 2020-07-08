import validateEmailAddress from "./validateEmailAddress";
import isPresent from "./isPresent";
import validateMobileNumber from "./validateMobileNumber";
import validateDateAndTime from "./validateDateAndTime";

export const validateVisit = ({
  patientName,
  contactName,
  contactEmail,
  contactNumber,
  callTime,
}) => {
  let errors = {};

  if (!isPresent(patientName)) {
    errors.patientName = "patientName must be present";
  }

  if (!isPresent(contactName)) {
    errors.contactName = "contactName must be present";
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

  if (!isPresent(contactNumber) && !isPresent(contactEmail)) {
    errors.contactEmail = "contactNumber or contactEmail must be present";
    errors.contactNumber = "contactNumber or contactEmail must be present";
  } else {
    if (contactEmail && !validateEmailAddress(contactEmail)) {
      errors.contactEmail = "contactEmail must be a valid email address";
    }
    if (contactNumber && !validateMobileNumber(contactNumber)) {
      errors.contactNumber = "contactNumber must be a valid mobile number";
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
