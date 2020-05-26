import validateEmailAddress from "./validateEmailAddress";

const validEmailAddresses = [
  "email@domain.com",
  "email@domain.COM",
  "firstname.lastname@domain.com",
  "firstname.o'lastname@domain.com",
  "email@subdomain.domain.com",
  "firstname+lastname@domain.com",
  "1234567890@domain.com",
  "email@domain-one.com",
  "_______@domain.com",
  "email@domain.name",
  "email@domain.superlongtld",
  "email@domain.co.jp",
  "firstname-lastname@domain.com",
  "info@german-financial-services.vermögensberatung",
  "info@german-financial-services.reallylongarbitrarytldthatiswaytoohugejustincase",
  "japanese-info@例え.テスト",
];

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
];

describe("validateEmailAddress", () => {
  validEmailAddresses.forEach((email_address) => {
    it(`accepts a valid email address: ${email_address}`, () => {
      expect(validateEmailAddress(email_address)).toEqual(true);
    });
  });

  invalidEmailAddresses.forEach((email_address) => {
    it(`rejects an invalid email address: ${email_address}`, () => {
      expect(validateEmailAddress(email_address)).toEqual(false);
    });
  });
});
