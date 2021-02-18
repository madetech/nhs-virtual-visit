import { ALPHANUMERIC } from "./validateEmailAddress";

const validateSignUpEmailAddress = (email) => {
    const emailDomain = process.env.NEXT_PUBLIC_SIGN_UP_EMAIL_DOMAIN

    const EMAIL_DOMAIN_REGEX_STRING = emailDomain.replace(',','|').toUpperCase();
    const EMAIL_VALIDATION_STRING =
    `^[${ALPHANUMERIC}.!#$%&'*+/=?^_\`{|}~-]` + 
    `+@${EMAIL_DOMAIN_REGEX_STRING}`
    const EMAIL_VALIDATION_REGEX = new RegExp(EMAIL_VALIDATION_STRING);
    return EMAIL_VALIDATION_REGEX.test(email.toUpperCase());
};
export default validateSignUpEmailAddress;