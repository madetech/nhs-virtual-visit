const REGEX = /^(?:(?:[^<>()[\]\\.,;:\s@"]+(?:\.[^<>()[\]\\.,;:\s@"]+)*)|(?:".+"))@(?:[A-Za-z0-9-]+\.)*(\w+\.\w+)$/;

export default (email) => {
    if(process.env.NEXT_PUBLIC_SIGN_UP_EMAIL_DOMAIN === undefined)
        return true;
    const emailDomains = process.env.NEXT_PUBLIC_SIGN_UP_EMAIL_DOMAIN.split(",");
    const matches = email.match(REGEX)
    if(!matches)
        return false
    return emailDomains.includes(matches[1])
};