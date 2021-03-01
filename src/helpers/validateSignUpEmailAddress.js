const REGEX = /^(?:(?:[^<>()[\]\\.,;:\s@"]+(?:\.[^<>()[\]\\.,;:\s@"]+)*)|(?:".+"))@(?:[A-Za-z0-9-]+\.)*(\w+\.\w+)$/;

const validateSignUpEmailAddress = (email, emailDomains) => {
    console.log(JSON.stringify(process.env));
    if(emailDomains === undefined) {
        if (process.env.NEXT_PUBLIC_SIGN_UP_EMAIL_DOMAIN === undefined)
            return true;
        emailDomains = process.env.NEXT_PUBLIC_SIGN_UP_EMAIL_DOMAIN.split(",");
    }
    const matches = email.match(REGEX)

    if(!matches)
        return false
    return emailDomains.includes(matches[1])
};

export default validateSignUpEmailAddress;