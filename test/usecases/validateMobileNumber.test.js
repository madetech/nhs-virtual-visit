import validateMobileNumber from "../../src/usecases/validateMobileNumber";

describe("validateMobileNumber", () => {
  it("should return validateMobileNumber", () => {
    expect(validateMobileNumber()).toBeDefined();
  });
});
