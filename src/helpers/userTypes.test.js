import { WARD_STAFF, TRUST_ADMIN, ADMIN } from "./userTypes";

describe("userTypes", () => {
  it("returns the wardStaff user type", () => {
    expect(WARD_STAFF).toEqual("wardStaff");
  });

  it("returns the trustAdmin user type", () => {
    expect(TRUST_ADMIN).toEqual("trustAdmin");
  });

  it("returns the admin user type", () => {
    expect(ADMIN).toEqual("admin");
  });
});
