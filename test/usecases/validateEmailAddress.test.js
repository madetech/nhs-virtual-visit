import validateEmailAddress from "../../src/usecases/validateEmailAddress";

describe("validateEmailAddress", () => {
  it("should return validateEmailAddress", () => {
    expect(validateEmailAddress()).toBeDefined();
  });
});
