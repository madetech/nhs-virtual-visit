import isPresent from "./isPresent";

describe("isPresent", () => {
  it("returns true if input has non-blank value", () => {
    expect(isPresent("value")).toBeTruthy();
  });
  it("returns false if input has blank value", () => {
    expect(isPresent("")).toBeFalsy();
  });
  it("returns false if input is null", () => {
    expect(isPresent(null)).toBeFalsy();
  });
  it("returns false if input is undefined", () => {
    expect(isPresent(undefined)).toBeFalsy();
  });
});
