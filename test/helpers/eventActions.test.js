import { JOIN_VISIT, LEAVE_VISIT } from "../../src/helpers/eventActions";

describe("eventActions", () => {
  it("returns the wardStaff user type", () => {
    expect(JOIN_VISIT).toEqual("join-visit");
  });

  it("returns the trustAdmin user type", () => {
    expect(LEAVE_VISIT).toEqual("leave-visit");
  });
});
