import { PhoneNumberUtil, PhoneNumberType } from "google-libphonenumber";

export default (input) => {
  const validator = PhoneNumberUtil.getInstance();

  try {
    const parsed = validator.parseAndKeepRawInput(input, "GB");

    return (
      validator.isValidNumber(parsed) &&
      validator.getNumberType(parsed) === PhoneNumberType.MOBILE
    );
  } catch (error) {
    return false;
  }
};
