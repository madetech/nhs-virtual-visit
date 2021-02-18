import { validateSignUpEmailAddress, createEmailDomainString } from "../../src/helpers/validateSignUpEmailAddress";

const validFrontEmail = [
    "firstname.lastname",
    "firstname.o'lastname",
    "email",
    "firstname+lastname",
    "1234567890",
    "_______",
    "firstname-lastname",
    "bam_bam_özgur"
]

const invalidSignUpEmailAddresses = [
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
];
const createValidEmailArray = (emailDomainString) =>{
    const emailDomainArray = emailDomainString.split(',')
    return emailDomainArray.map(domain=> validFrontEmail.map(frontEmail=>`${frontEmail}@${domain}`)).flat();
}

describe("validateSignUpEmailAddress", () => {
    describe("checks for valid email domain",()=> {
        const emailDomainString = process.env.NEXT_PUBLIC_SIGN_UP_EMAIL_DOMAIN;
        const validSignUpEmailAddresses = createValidEmailArray(emailDomainString);
        validSignUpEmailAddresses.forEach((email_address) => {
            it(`accepts a valid email address: ${email_address}`, () => {
              expect(validateSignUpEmailAddress(email_address)).toEqual(true);
            });
        });
        invalidSignUpEmailAddresses.forEach((email_address) => {
            it(`rejects an invalid email address: ${email_address}`, () => {
                expect(validateSignUpEmailAddress(email_address)).toEqual(false);
            });
        });
    });
});

describe("createEmailDomainString",()=>{
    it("returns empty string when accepts an empty array",()=>{
        expect(createEmailDomainString([])).toEqual('');
    })
    it("returns string when accepts array of length 1",()=>{
        expect(createEmailDomainString(['day.net'])).toEqual('day.net');
    })
    it("returns correct string when accepts array of length 2",()=>{
        expect(createEmailDomainString(['day.net', 'night.net'])).toEqual('day.net|night.net');
    })
    it("returns correct string when accepts array of length greater than 2",()=>{
        expect(createEmailDomainString(['day.net', 'night.net','evening.com', 'afternoon.uk'])).toEqual('day.net|night.net|evening.com|afternoon.uk');
    })
})
