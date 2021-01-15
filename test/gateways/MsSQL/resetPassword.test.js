import resetPassword from "../../../src/gateways/MsSQL/resetPassword";
import MsSQL from "../../../src/gateways/MsSQL";

jest.mock("../../../src/gateways/MsSQL");

describe("resetPassword", () => {
  it("errors if no password is present", async () => {
    const request = { password: "", email: "nhs-admin@nhs.co.uk" };

    const { resetSuccess, error } = await resetPassword(request);

    expect(resetSuccess).toEqual(false);
    expect(error).toEqual("password is not defined");
  });

  it("errors if no email is present", async () => {
    const request = { password: "validPassword", email: "" };

    const { resetSuccess, error } = await resetPassword(request);

    expect(resetSuccess).toEqual(false);
    expect(error).toEqual("email is not defined");
  });

  it("resets the password with valid email and password", async () => {
    const inputSpy = jest.fn().mockReturnThis();

    MsSQL.getConnectionPool = jest.fn(() => {
      return {
        request: jest.fn().mockReturnThis(),
        input: inputSpy,
        query: jest.fn().mockReturnValue({
          recordset: [{ email: "nhs-admin@mhs.co.uk" }],
        }),
      };
    });

    const request = { password: "validPassword", email: "nhs-admin@nhs.co.uk" };

    const { resetSuccess, error } = await resetPassword(request);

    expect(resetSuccess).toEqual(true);
    expect(error).toBeNull();
    expect(inputSpy).toHaveBeenCalledTimes(2);
  });

  it("errors if no records are found for a given email", async () => {
    MsSQL.getConnectionPool = jest.fn(() => {
      return {
        request: jest.fn().mockReturnThis(),
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockReturnValue({ recordset: [] }),
      };
    });

    const request = {
      password: "validPassword",
      email: "invalid-email@nhs.co.uk",
    };

    const { resetSuccess, error } = await resetPassword(request);

    expect(resetSuccess).toEqual(false);
    expect(error).toEqual("User email doesn't exist");
  });

  it("errors if there is a problem with the database call", async () => {
    MsSQL.getConnectionPool = jest.fn(() => {
      return {
        request: jest.fn().mockReturnThis(),
        input: jest.fn().mockReturnThis(),
        query: jest.fn(() => {
          throw new Error("DB Error!");
        }),
      };
    });

    const request = { password: "validPassword", email: "nhs-admin@nhs.co.uk" };

    const { resetSuccess, error } = await resetPassword(request);

    expect(resetSuccess).toEqual(false);
    expect(error).toEqual("Error: DB Error!");
  });
});
