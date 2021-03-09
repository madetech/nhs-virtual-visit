import addToUserVerificationTableGateway from "../../../src/gateways/MsSQL/addToUserVerificationTable";
import logger from "../../../logger"

describe("addToUserVerificationTableGateway", () => {
  let newUser;

  beforeEach(() => {
    newUser = {
      user_id: 1,
      code: "uuid",
      hash: "hashedUuid",
      type: "resetPassword",
    };
  });

  it("adds a user to user verification table", async () => {
    const inputSpy = jest.fn().mockReturnThis();
    const getMsSqlConnPool = jest.fn(() => {
      return {
        request: jest.fn().mockReturnThis(),
        input: inputSpy,
        query: jest.fn().mockReturnValue({
          recordset: [
            {
              id: 1,
              created_at: "01/01/2001",
              user_id: 1,
              type: "resetPassword",
              code: "uuid",
              hash: "hashedUuid",
              verified: 0,
            },
          ],
        }),
      };
    });

    const { verifyUser, error } = await addToUserVerificationTableGateway({
      getMsSqlConnPool,
      logger
    })(newUser);

    const expectedResponse = {
      id: 1,
      created_at: "01/01/2001",
      user_id: 1,
      type: "resetPassword",
      code: "uuid",
      hash: "hashedUuid",
      verified: 0,
    };

    expect(error).toBeNull();
    expect(verifyUser).toEqual(expectedResponse);
    expect(inputSpy).toHaveBeenCalledWith("user_id", 1);
    expect(inputSpy).toHaveBeenCalledWith("code", "uuid");
    expect(inputSpy).toHaveBeenCalledWith("hash", "hashedUuid");
    expect(inputSpy).toHaveBeenCalledWith("type", "resetPassword");
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

    const { verifyUser, error } = await addToUserVerificationTableGateway({
      getMsSqlConnPool,
      logger
    })(newUser);

    expect(verifyUser).toBeNull();
    expect(error).toEqual("Error: DB Error!");
  });
});
