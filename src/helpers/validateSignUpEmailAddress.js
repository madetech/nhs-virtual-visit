const ALPHANUMERIC =
  "a-zA-Z0-9àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ" + // Number and letters including accented characters
  "\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\uFF00-\uFFEF\u4E00-\u9FAF\u2605-\u2606\u2190-\u2195\u203B"; // Chinese/Japanese/Korean characters

export const validateSignUpEmailAddress = (email) => {
    const emailDomain = process.env.NEXT_PUBLIC_ENV === "production" ? process.env.NEXT_PUBLIC_SIGN_UP_EMAIL_DOMAIN_PROD: process.env.NEXT_PUBLIC_SIGN_UP_EMAIL_DOMAIN_DEV
    const emailDomainArray = emailDomain.split(',');
    const EMAIL_DOMAIN_REGEX_STRING = createEmailDomainString(emailDomainArray).toUpperCase();
    const EMAIL_VALIDATION_STRING =
    `^[${ALPHANUMERIC}.!#$%&'*+/=?^_\`{|}~-]` + 
    `+@${EMAIL_DOMAIN_REGEX_STRING}`
    const EMAIL_VALIDATION_REGEX = new RegExp(EMAIL_VALIDATION_STRING);
    return EMAIL_VALIDATION_REGEX.test(email.toUpperCase());
};

export const createEmailDomainString = (emailDomainArray) => {
    return emailDomainArray.reduce((emailDomainString, emailDomain, idx, emailDomainArray)=>(
        emailDomainArray.length - 1 === idx) ? emailDomainString += emailDomain:emailDomainString += emailDomain + '|',
    '');
}
