import tokenTypes from "./tokenTypes";

describe("tokenTypes", () => {
  it("returns the wardStaff token type", () => {
    expect(tokenTypes.WARD_STAFF).toEqual("wardStaff");
  });

  it("returns the trustAdmin token type", () => {
    expect(tokenTypes.TRUST_ADMIN).toEqual("trustAdmin");
  });
});
