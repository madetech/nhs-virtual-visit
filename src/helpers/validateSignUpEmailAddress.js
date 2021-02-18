const ALPHANUMERIC =
  "a-zA-Z0-9àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ" + // Number and letters including accented characters
  "\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\uFF00-\uFFEF\u4E00-\u9FAF\u2605-\u2606\u2190-\u2195\u203B"; // Chinese/Japanese/Korean characters

const validateSignUpEmailAddress = (email) => {
    const emailDomain = process.env.NODE_ENV === "production" ? process.env.SIGN_UP_EMAIL_DOMAIN_PROD: process.env.SIGN_UP_EMAIL_DOMAIN_DEV
    const emailDomainArray = emailDomain.split(',');
    const EMAIL_DOMAIN_REGEX_STRING = `${emailDomainArray[0].toUpperCase()} || ${emailDomainArray[1].toUpperCase()}`;
    console.log(EMAIL_DOMAIN_REGEX_STRING)
    const EMAIL_VALIDATION_STRING =
    `^[${ALPHANUMERIC}.!#$%&'*+/=?^_\`{|}~-]` + 
    `+@${EMAIL_DOMAIN_REGEX_STRING}`

    const EMAIL_VALIDATION_REGEX = new RegExp(EMAIL_VALIDATION_STRING);
    // console.log(process.env.SIGN_UP_EMAIL_DOMAIN_PROD);
    // console.log(emailDomain);
    return EMAIL_VALIDATION_REGEX.test(email.toUpperCase());
};

export default validateSignUpEmailAddress;