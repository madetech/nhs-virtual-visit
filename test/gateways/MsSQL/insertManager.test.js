import insertManagerGateway from "../../../src/gateways/MsSQL/insertManager";
import bcrypt from "bcryptjs";
import logger from "../../../logger"

jest.mock("bcryptjs");

describe("insertManagerGateway", () => {
  let newManager;
  beforeEach(() => {
    newManager = {
      email: "nhs-manager@nhs.co.uk",
      password: "password",
      organisationId: 1,
      type: "manager",
    };
  });

  it("adds a new manager to the database", async () => {
    const inputSpy = jest.fn().mockReturnThis();
    const getMsSqlConnPool = jest.fn(() => {
      return {
        request: jest.fn().mockReturnThis(),
        input: inputSpy,
        query: jest.fn().mockReturnValue({
          recordset: [
            {
              id: 1,
              email: "nhs-manager@nhs.co.uk",
              password: "hashedPassword",
              created_at: "01/01/2001",
              updated_at: "01/01/2001",
              type: "manager",
              organisation_id: 1,
              uuid: "uuid",
              status: 0,
            },
          ],
        }),
      };
    });

    bcrypt.genSalt = jest.fn();
    bcrypt.hashSync.mockReturnValue("hashedPassword");

    const { user, error } = await insertManagerGateway({
      getMsSqlConnPool,
      logger
    })(newManager);

    const expectedResponse = {
      id: 1,
      email: "nhs-manager@nhs.co.uk",
      password: "hashedPassword",
      created_at: "01/01/2001",
      updated_at: "01/01/2001",
      type: "manager",
      organisation_id: 1,
      uuid: "uuid",
      status: 0,
    };

    expect(error).toBeNull();
    expect(user).toEqual(expectedResponse);
    expect(inputSpy).toHaveBeenCalledWith("email", "nhs-manager@nhs.co.uk");
    expect(inputSpy).toHaveBeenCalledWith("password", "hashedPassword");
    expect(inputSpy).toHaveBeenCalledWith("type", "manager");
    expect(inputSpy).toHaveBeenCalledWith("organisationId", 1);
  });

  it("returns an error if there is a problem with the database call", async () => {
    const getMsSqlConnPool = jest.fn(() => {
      return {
        request: jest.fn().mockReturnThis(),
        input: jest.fn().mockReturnThis(),
        query: jest.fn(() => {
          throw new Error("DB Error!");
        }),
      };
    });

    const { user, error } = await insertManagerGateway({
      getMsSqlConnPool,
      logger
    })(newManager);

    expect(user).toBeNull();
    expect(error).toEqual("Error: DB Error!");
  });
});
