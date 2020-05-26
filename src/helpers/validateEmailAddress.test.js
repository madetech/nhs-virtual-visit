import validateEmailAddress from "./validateEmailAddress";

describe("validateEmailAddress", () => {
  it("accepts a valid email address", () => {
    expect(validateEmailAddress("hello@goodbye.com")).toEqual(true);
  });

  it("reject and invalid email address", () => {
    expect(validateEmailAddress("INVALID_EMAIL")).toEqual(false);
  });
});
