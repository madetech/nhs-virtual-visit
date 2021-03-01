const REGEX = /^(?:(?:[^<>()[\]\\.,;:\s@"]+(?:\.[^<>()[\]\\.,;:\s@"]+)*)|(?:".+"))@(?:[A-Za-z0-9-]+\.)*(\w+\.\w+)$/;

const validateSignUpEmailAddress = (email, emailDomains) => {
    if(emailDomains === undefined) {
        if (process.env.SIGN_UP_EMAIL_DOMAINS === undefined)
            return true;
        emailDomains = process.env.SIGN_UP_EMAIL_DOMAINS.split(",");
    }
    const matches = email.match(REGEX)

    if(!matches)
        return false
    return emailDomains.includes(matches[1])
};

export default validateSignUpEmailAddress;