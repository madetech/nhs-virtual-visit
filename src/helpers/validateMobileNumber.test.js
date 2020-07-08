import validateMobileNumber from "./validateMobileNumber";

describe("validateMobileNumber", () => {
  it("accepts a UK mobile number", () => {
    const actual = validateMobileNumber("07123456789");
    expect(actual).toEqual(true);
  });

  it("accepts an Italian mobile number (+)", () => {
    const actual = validateMobileNumber("+393123456789");
    expect(actual).toEqual(true);
  });

  it("accepts an Italian mobile number (00)", () => {
    const actual = validateMobileNumber("00393123456789");
    expect(actual).toEqual(true);
  });

  it("rejects a UK landline number", () => {
    const actual = validateMobileNumber("02045678901");
    expect(actual).toEqual(false);
  });

  it("rejects a random string", () => {
    const actual = validateMobileNumber("invalidMobileNumber");
    expect(actual).toEqual(false);
  });
});
