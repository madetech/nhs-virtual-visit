import verifyTimeSensitiveLinkGateway from "../../../src/gateways/MsSQL/verifyTimeSensitiveLink";
import logger from "../../../logger"

describe("verifyTimeSensitiveLinkGateway", () => {
  it("verifies that the sign up link is valid", async () => {
    const inputSpy = jest.fn().mockReturnThis();
    const getMsSqlConnPool = jest.fn(() => {
      return {
        request: jest.fn().mockReturnThis(),
        input: inputSpy,
        query: jest.fn().mockReturnValue({
          recordset: [
            {
              user_id: 1,
              organisation_id: 1,
              verified: false,
              status: 0,
              email: "test@email.com",
            },
          ],
        }),
      };
    });

    const hash = "hash";
    const uuid = "uuid";

    const { user, error } = await verifyTimeSensitiveLinkGateway({
      getMsSqlConnPool,
      logger
    })({ hash, uuid });

    const expectedResponse = {
      user_id: 1,
      organisation_id: 1,
      verified: false,
      status: 0,
      email: "test@email.com",
    };

    expect(error).toBeNull();
    expect(user).toEqual(expectedResponse);
    expect(inputSpy).toHaveBeenCalledWith("hash", "hash");
    expect(inputSpy).toHaveBeenCalledWith("uuid", "uuid");
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

    const hash = "hash";
    const uuid = "uuid";

    const { user, error } = await verifyTimeSensitiveLinkGateway({
      getMsSqlConnPool,
      logger
    })({ hash, uuid });

    expect(user).toBeNull();
    expect(error).toEqual("Error: DB Error!");
  });
});
