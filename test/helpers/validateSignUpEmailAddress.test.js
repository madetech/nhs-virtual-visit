import validateSignUpEmailAddress from "../../src/helpers/validateSignUpEmailAddress";

const validFrontEmail = [
    "firstname.lastname@",
    "firstname.o'lastname@",
    "email@",
    "firstname+lastname@",
    "1234567890@",
    "_______@",
    "firstname-lastname@",
    "bam_bam_özgur@",
    "test@trust."
]

const invalidEmailAddresses = [
  "email@[123.123.123.123]",
  "plainaddress",
  "@no-local-part.com",
  "Outlook Contact <outlook-contact@domain.com>",
  "no-at.domain.com",
  "no-tld@domain",
  ";beginning-semicolon@domain.co.uk",
  "middle-semicolon@domain.co;uk",
  "trailing-semicolon@domain.com;",
  '"email+leading-quotes@domain.com',
  'email+middle"-quotes@domain.com',
  '"quoted-local-part"@domain.com',
  '"quoted@domain.com"',
  "lots-of-dots@domain..gov..uk",
  "multiple@domains@domain.com",
  "spaces in local@domain.com",
  "spaces-in-domain@dom ain.com",
  "underscores-in-domain@dom_ain.com",
  "pipe-in-domain@example.com|gov.uk",
  "comma,in-local@gov.uk",
  "comma-in-domain@domain,gov.uk",
  "pound-sign-in-local£@domain.com",
  "local-with-’-apostrophe@domain.com",
  "local-with-”-quotes@domain.com",
  "domain-starts-with-a-dot@.domain.com",
  "brackets(in)local@domain.com",
  "emaill@.trust.nhs.uk",
  "test@test.org",
  "test@test.nhs.com",
  "example@example.com",
];

const createValidEmailArray = (emailDomainString, validFrontEmail) =>{
    const emailDomainArray = emailDomainString ? emailDomainString.split(',') : []
    return emailDomainArray.map(domain=> validFrontEmail.map(frontEmail=>`${frontEmail}${domain}`)).flat();
}

describe("validateSignUpEmailAddress", () => {
    describe("checks for valid email domain",()=> {
        process.env.SIGN_UP_EMAIL_DOMAINS="madetech.com,nhs.uk";
        const emailDomainString = process.env.SIGN_UP_EMAIL_DOMAINS;
        const validSignUpEmailAddresses = createValidEmailArray(emailDomainString, validFrontEmail);
        validSignUpEmailAddresses.forEach((email_address) => {
            it(`accepts a valid email address: ${email_address}`, () => {
              expect(validateSignUpEmailAddress(email_address)).toEqual(true);
            });
        });
        invalidEmailAddresses.forEach((email_address) => {
            it(`rejects an invalid email address: ${email_address}`, () => {
                expect(validateSignUpEmailAddress(email_address)).toEqual(false);
            });
        });
    });
});

describe("createValidEmailArray",()=>{
    it("returns empty array when given empty string and an empty array",()=>{
        expect(createValidEmailArray('', [])).toEqual([]);
    })
    it("returns empty array when given empty string and an array of length 1",()=>{
        expect(createValidEmailArray('', ['abc_345@'])).toEqual([]);
    })
    it("returns correct array when given a string with no commas and an array of length 1",()=>{
        expect(createValidEmailArray('nhs.uk', ['hello@'])).toEqual(['hello@nhs.uk']);
    })
    it("returns empty array when given empty string and an array of length 1",()=>{
        expect(createValidEmailArray('', ['abc_345@'])).toEqual([]);
    })
    it("returns correct array when given a string with commas and an array of length more than 2",()=>{
        expect(createValidEmailArray('nhs.uk,madetech.com', ['hello@','abd.123@','abc_ijo@'])).toEqual(['hello@nhs.uk', 'abd.123@nhs.uk','abc_ijo@nhs.uk','hello@madetech.com', 'abd.123@madetech.com','abc_ijo@madetech.com',]);
    })
});