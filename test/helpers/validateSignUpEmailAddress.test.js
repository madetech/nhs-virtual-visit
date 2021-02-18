import validateSignUpEmailAddress from "../../src/helpers/validateSignUpEmailAddress";

const validSignUpEmailAddresses = [
  /*  "email@madetech.com",
    "email@madetech.COM",
    "firstname.lastname@madetech.com",
    "firstname.o'lastname@madetech.com",
    "email@MADETECH.COM",
    "firstname+lastname@madetech.com",
    "1234567890@madetech.com",
    "email@madetech.com",
    "_______@madetech.com",
    "firstname-lastname@madetech.com",
    "info@madetech.com",
    "info@MADETECH.com",
    "japanese-info@madetech.com",
    */
   "email@nhs.net",
   "email@nhs.uk"
];

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

describe("validateSignUpEmailAddress", () => {
    describe.skip("checks for valid email domain when NODE_ENV==='test'",()=> {
        process.env.NODE_ENV="test";
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
    describe.skip("checks for valid email domain when NODE_ENV==='development'",()=> {
        process.env.NODE_ENV="development";
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
    describe("checks for valid email domain when NODE_ENV==='production",()=>{
        process.env.NODE_ENV="production";
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
    })
//   validSignUpEmailAddresses.forEach((email_address) => {
//     it(`accepts a valid email address: ${email_address}`, () => {
//       expect(validateSignUpEmailAddress(email_address)).toEqual(true);
//     });
//   });

//   invalidSignUpEmailAddresses.forEach((email_address) => {
//     it(`rejects an invalid email address: ${email_address}`, () => {
//       expect(validateSignUpEmailAddress(email_address)).toEqual(false);
//     });
//   });
});
