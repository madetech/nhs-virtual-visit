const ALPHANUMERIC =
  "a-zA-Z0-9àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ" + // Number and letters including accented characters
  "\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\uFF00-\uFFEF\u4E00-\u9FAF\u2605-\u2606\u2190-\u2195\u203B"; // Chinese/Japanese/Korean characters
const validateSignUpEmailAddress = (email) => {
    const emailDomain = process.env.NEXT_PUBLIC_SIGN_UP_EMAIL_DOMAIN;
    const EMAIL_DOMAIN_REGEX_STRING = emailDomain.replace(',','|').toUpperCase();
    const EMAIL_VALIDATION_STRING =
    //`(?:[a-z0-9!#$%&'*+/=?^_\`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_\`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")` + 
    //`^[${ALPHANUMERIC}.!#$%&'*+/=?\^_\`{|}~\-]` + // Local part
    `(?:[a-z0-9!#$%&'*+/=?^_\`{|}~\-]+(?:\.[a-z0-9!#$%&'*+/=?\^_\`{|}~\-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|
        \\[\x01-\x09\x0b\x0c\x0e-\x7f])*")+@([A-Za-z0-9\-]\.)*nhs.uk|madetech.com`;
    const EMAIL_VALIDATION_REGEX = new RegExp(EMAIL_VALIDATION_STRING);
    return EMAIL_VALIDATION_REGEX.test(email.toUpperCase());
};
export default validateSignUpEmailAddress;  