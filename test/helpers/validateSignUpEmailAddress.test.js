import validateSignUpEmailAddress from "../../src/helpers/validateSignUpEmailAddress";
import { invalidEmailAddresses } from "./validateEmailAddress.test";

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

const createValidEmailArray = (emailDomainString, validFrontEmail) =>{
    const emailDomainArray = emailDomainString ? emailDomainString.split(',') : []
    return emailDomainArray.map(domain=> validFrontEmail.map(frontEmail=>`${frontEmail}${domain}`)).flat();
}

describe("validateSignUpEmailAddress", () => {
    describe("checks for valid email domain",()=> {
        process.env.NEXT_PUBLIC_SIGN_UP_EMAIL_DOMAIN="madetech.com,nhs.co.uk";
        const emailDomainString = process.env.NEXT_PUBLIC_SIGN_UP_EMAIL_DOMAIN;
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
        expect(createValidEmailArray('nhs.com', ['hello@'])).toEqual(['hello@nhs.com']);
    })
    it("returns empty array when given empty string and an array of length 1",()=>{
        expect(createValidEmailArray('', ['abc_345@'])).toEqual([]);
    })
    it("returns correct array when given a string with commas and an array of length more than 2",()=>{
        expect(createValidEmailArray('nhs.com,madetech.com', ['hello@','abd.123@','abc_ijo@'])).toEqual(['hello@nhs.com', 'abd.123@nhs.com','abc_ijo@nhs.com','hello@madetech.com', 'abd.123@madetech.com','abc_ijo@madetech.com',]);
    })
});