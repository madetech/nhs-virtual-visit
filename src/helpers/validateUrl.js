export const URL_VALIDATION_STRING =
  "^(?:(?:(?:https?):)?\\/\\/)" + // Protocol
  "(?:\\S+(?::\\S*)?@)?(?:(?!(?:10|127)(?:\\.\\d{1,3}){3})(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" + // Local IP addresses
  "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))" + // Words 'n' stuff
  "(?::\\d{2,5})?" + // Port
  "(?:[/?#]\\S*)?$"; // query string

const URL_REGEX = new RegExp(URL_VALIDATION_STRING, "i");

export const validateUrl = (url) => {
  return URL_REGEX.test(url);
};

export default validateUrl;
