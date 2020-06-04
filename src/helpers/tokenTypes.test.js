import { WARD_STAFF, TRUST_ADMIN, ADMIN } from "./tokenTypes";

describe("tokenTypes", () => {
  it("returns the wardStaff token type", () => {
    expect(WARD_STAFF).toEqual("wardStaff");
  });

  it("returns the trustAdmin token type", () => {
    expect(TRUST_ADMIN).toEqual("trustAdmin");
  });

  it("returns the admin token type", () => {
    expect(ADMIN).toEqual("admin");
  });
});
