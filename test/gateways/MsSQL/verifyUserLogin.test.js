import verifyUserLoginGateway from "../../../src/gateways/MsSQL/verifyUserLogin";
import bcrypt from "bcryptjs";
import logger from "../../../logger"

jest.mock("bcryptjs");

describe("verifyUserLogin", () => {
  it("verifies user if email and password are valid", async () => {
    const inputSpy = jest.fn().mockReturnThis();
    const getMsSqlConnPool = jest.fn(() => {
      return {
        request: jest.fn().mockReturnThis(),
        input: inputSpy,
        query: jest.fn().mockReturnValue({
          recordset: [
            {
              id: 1,
              organisation_id: 1,
              type: "manager",
            },
          ],
        }),
      };
    });

    bcrypt.compareSync.mockReturnValue(true);

    const email = "nhs-manager@nhs.co.uk";
    const password = "password";

    const {
      validUser,
      trust_id,
      user_id,
      type,
      error,
    } = await verifyUserLoginGateway({
      getMsSqlConnPool,
      logger
    })(email, password);

    expect(validUser).toEqual(true);
    expect(trust_id).toEqual(1);
    expect(user_id).toEqual(1);
    expect(type).toEqual("manager");
    expect(error).toBeNull();
    expect(inputSpy).toHaveBeenCalledWith("email", "nhs-manager@nhs.co.uk");
  });

  it("returns an error if the wrong password is given", async () => {
    const getMsSqlConnPool = jest.fn(() => {
      return {
        request: jest.fn().mockReturnThis(),
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockReturnValue({
          recordset: [{ id: 1, organisation_id: 1, type: "manager" }],
        }),
      };
    });

    bcrypt.compareSync.mockReturnValue(false);

    const email = "nhs-admin@nhs.co.uk";
    const wrongPassword = "wrongPassword";

    const {
      validUser,
      trust_id,
      user_id,
      type,
      error,
    } = await verifyUserLoginGateway({
      getMsSqlConnPool,
      logger
    })(email, wrongPassword);

    expect(validUser).toEqual(false);
    expect(trust_id).toBeNull();
    expect(user_id).toBeNull();
    expect(type).toBeNull();
    expect(error).toEqual("Incorrect email or password");
  });

  it("errors if no records are found for a given email", async () => {
    const getMsSqlConnPool = jest.fn(() => {
      return {
        request: jest.fn().mockReturnThis(),
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockReturnValue({ recordset: [] }),
      };
    });

    bcrypt.compareSync.mockReturnValue(false);

    const email = "no-email@nhs.co.uk";
    const password = "password";

    const {
      validUser,
      trust_id,
      user_id,
      type,
      error,
    } = await verifyUserLoginGateway({
      getMsSqlConnPool,
      logger
    })(email, password);

    expect(validUser).toEqual(false);
    expect(trust_id).toBeNull();
    expect(user_id).toBeNull();
    expect(type).toBeNull();
    expect(error).toEqual("Email does not exist in the database");
  });

  it("errors if there is a problem with the database call", async () => {
    const getMsSqlConnPool = jest.fn(() => {
      return {
        request: jest.fn().mockReturnThis(),
        input: jest.fn().mockReturnThis(),
        query: jest.fn(() => {
          throw new Error();
        }),
      };
    });

    const email = "nhs-admin@nhs.co.uk";
    const password = "password";

    const {
      validUser,
      trust_id,
      user_id,
      type,
      error,
    } = await verifyUserLoginGateway({
      getMsSqlConnPool,
      logger
    })(email, password);

    expect(validUser).toEqual(false);
    expect(trust_id).toBeNull();
    expect(user_id).toBeNull();
    expect(type).toBeNull();
    expect(error).toEqual("Email does not exist in the database");
  });
});
