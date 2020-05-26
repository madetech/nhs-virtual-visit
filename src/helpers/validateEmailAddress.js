const ALPHANUMERIC =
  "a-zA-Z0-9àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ" + // Number and letters including accented characters
  "\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\uFF00-\uFFEF\u4E00-\u9FAF\u2605-\u2606\u2190-\u2195\u203B"; // Chinese/Japanese/Korean characters

const EMAIL_VALIDATION_STRING =
  `^[${ALPHANUMERIC}.!#$%&'*+/=?^_\`{|}~-]` + // Local part
  `+@[${ALPHANUMERIC}](?:[${ALPHANUMERIC}-]` + // Domain name
  `{0,61}[${ALPHANUMERIC}])?(?:\\.` + // Allow periods in domain name
  `[${ALPHANUMERIC}](?:[${ALPHANUMERIC}-]{0,61}[${ALPHANUMERIC}])?)*\\.` +
  `[${ALPHANUMERIC}](?:[${ALPHANUMERIC}-]{0,61}` + // End of domain
  `[${ALPHANUMERIC}])$`;

const EMAIL_VALIDATION_REGEX = new RegExp(EMAIL_VALIDATION_STRING);

export default (email) => {
  return EMAIL_VALIDATION_REGEX.test(email);
};
