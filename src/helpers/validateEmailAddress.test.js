import validateEmailAddress from "./validateEmailAddress";

describe("validateEmailAddress", () => {
  it("accepts an email address", () => {
    const actual = validateEmailAddress("hello@goodbye.com");
    expect(actual).toEqual(true);
  });
});
