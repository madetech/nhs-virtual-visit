const emailDomain = process.env.NEXT_PUBLIC_SIGN_UP_EMAIL_DOMAIN || ".+";
const EMAIL_DOMAIN_REGEX_STRING = emailDomain.replace(',','|').toUpperCase();
const EMAIL_VALIDATION_STRING =
`(?:[a-z0-9!#$%&'*+/=?^_\`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_\`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")` + 
`+@([A-Za-z0-9\-]\.)*${EMAIL_DOMAIN_REGEX_STRING}`
const EMAIL_VALIDATION_REGEX = new RegExp(EMAIL_VALIDATION_STRING,'i');

const validateSignUpEmailAddress = (email) => {
    return EMAIL_VALIDATION_REGEX.test(email);
};
export default validateSignUpEmailAddress;