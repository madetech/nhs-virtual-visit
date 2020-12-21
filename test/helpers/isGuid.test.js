import isGuid from "../../src/helpers/isGuid";

describe("isGuid", () => {
  it("rejects an invalid guid", () => {
    expect(isGuid(null)).toBeFalsy();
    expect(isGuid("")).toBeFalsy();
    expect(isGuid(42)).toBeFalsy();
    expect(isGuid("efweef")).toBeFalsy();
  });
  it("accepts a valid guid", () => {
    expect(isGuid("38c9a1a7-c37f-411f-a64a-93661737f22d")).toBeTruthy();
    expect(isGuid("DC572BC9-4E99-4A49-8318-C42F5694DFDF")).toBeTruthy();
  });
});
