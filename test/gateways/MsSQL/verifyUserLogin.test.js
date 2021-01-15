import verifyUserLogin from "../../../src/gateways/MsSQL/verifyUserLogin";
import MsSQL from "../../../src/gateways/MsSQL";
import bcrypt from "bcryptjs";

jest.mock("../../../src/gateways/MsSQL");
jest.mock("bcryptjs");

describe("verifyUserLogin", () => {
  it("errors if no password is present", async () => {
    const email = "nhs-admin@nhs.co.uk";
    const password = "";

    const { validUser, trust_id, type, error } = await verifyUserLogin(
      email,
      password
    );

    expect(validUser).toEqual(false);
    expect(trust_id).toBeNull();
    expect(type).toBeNull();
    expect(error).toEqual("password is not defined");
  });

  it("errors if no email is present", async () => {
    const email = "";
    const password = "password";

    const { validUser, trust_id, type, error } = await verifyUserLogin(
      email,
      password
    );

    expect(validUser).toEqual(false);
    expect(trust_id).toBeNull();
    expect(type).toBeNull();
    expect(error).toEqual("email is not defined");
  });

  it("resets the password with valid email and password", async () => {
    const inputSpy = jest.fn().mockReturnThis();

    MsSQL.getConnectionPool = jest.fn(() => {
      return {
        request: jest.fn().mockReturnThis(),
        input: inputSpy,
        query: jest.fn().mockReturnValue({
          recordset: [
            { organisation_id: 1, type: "manager", password: "password" },
          ],
        }),
      };
    });

    bcrypt.compareSync.mockReturnValue(true);

    const email = "nhs-admin@nhs.co.uk";
    const password = "password";

    const { validUser, trust_id, type, error } = await verifyUserLogin(
      email,
      password
    );

    expect(validUser).toEqual(true);
    expect(trust_id).toEqual(1);
    expect(type).toEqual("manager");
    expect(error).toBeNull();
    expect(inputSpy).toHaveBeenCalledWith("email", "nhs-admin@nhs.co.uk");
  });

  it("returns an error if the wrong password is given", async () => {
    MsSQL.getConnectionPool = jest.fn(() => {
      return {
        request: jest.fn().mockReturnThis(),
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockReturnValue({
          recordset: [
            { organisation_id: 1, type: "manager", password: "password" },
          ],
        }),
      };
    });

    bcrypt.compareSync.mockReturnValue(false);

    const email = "nhs-admin@nhs.co.uk";
    const wrongPassword = "wrongPassword";

    const { validUser, trust_id, type, error } = await verifyUserLogin(
      email,
      wrongPassword
    );

    expect(validUser).toEqual(false);
    expect(trust_id).toBeNull();
    expect(type).toBeNull();
    expect(error).toEqual("Incorrect email or password");
  });

  it("errors if no records are found for a given email", async () => {
    MsSQL.getConnectionPool = jest.fn(() => {
      return {
        request: jest.fn().mockReturnThis(),
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockReturnValue({ recordset: [] }),
      };
    });

    bcrypt.compareSync.mockReturnValue(false);

    const email = "nhs-admin@nhs.co.uk";
    const password = "password";

    const { validUser, trust_id, type, error } = await verifyUserLogin(
      email,
      password
    );

    expect(validUser).toEqual(false);
    expect(trust_id).toBeNull();
    expect(type).toBeNull();
    expect(error).toBeNull();
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

    const email = "nhs-admin@nhs.co.uk";
    const password = "password";

    const { validUser, trust_id, type, error } = await verifyUserLogin(
      email,
      password
    );

    expect(validUser).toEqual(false);
    expect(trust_id).toBeNull();
    expect(type).toBeNull();
    expect(error).toEqual("Error: DB Error!");
  });
});
