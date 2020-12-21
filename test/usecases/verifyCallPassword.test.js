import verifyCallPassword from "../../src/usecases/verifyCallPassword";

describe("verifyCallPassword", () => {
  const container = {
    getRetrieveVisitByCallId: () => (callId) => {
      if (callId === 1) {
        return {
          scheduledCall: {
            callId: 1,
            callPassword: "securePassword",
          },
          error: null,
        };
      } else if (callId === 2) {
        return {
          scheduledCall: {
            callId: 2,
            callPassword: "",
          },
          error: null,
        };
      } else {
        return {
          scheduledCall: null,
          error: "No call exists by that id",
        };
      }
    },
  };
  it("returns true when password matches call db password", async () => {
    const input = "securePassword";

    expect(await verifyCallPassword(container)(1, input)).toEqual({
      validCallPassword: true,
      error: null,
    });
  });
  it("returns false when the password does not match", async () => {
    const input = "not-valid";

    expect(await verifyCallPassword(container)(1, input)).toEqual({
      validCallPassword: false,
      error: null,
    });
  });
  it("returns false when the password is undefined", async () => {
    const input = undefined;

    expect(await verifyCallPassword(container)(1, input)).toEqual({
      validCallPassword: false,
      error: null,
    });
  });
  it("returns true when the call does not have a password", async () => {
    const input = "";

    expect(await verifyCallPassword(container)(2, input)).toEqual({
      validCallPassword: true,
      error: null,
    });
  });
  it("returns false when the callId does not exist", async () => {
    const input = "";

    expect(await verifyCallPassword(container)(12345, input)).toEqual({
      validCallPassword: false,
      error: "No call exists by that id",
    });
  });
});
