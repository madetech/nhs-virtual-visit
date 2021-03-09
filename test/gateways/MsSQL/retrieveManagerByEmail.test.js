import retrieveManagerByEmailGateway from "../../../src/gateways/MsSQL/retrieveManagerByEmail";
import logger from "../../../logger"

describe("retrieveManagerByEmailGateway", () => {
  it("retrieves manager for a given email", async () => {
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
              type: "type",
              uuid: "uuid",
            },
          ],
        }),
      };
    });

    const email = "nhs-manager@nhs.co.uk";
    const { manager, error } = await retrieveManagerByEmailGateway({
      getMsSqlConnPool,
      logger
    })(email);

    const expectedResponse = {
      id: 1,
      email: "nhs-manager@nhs.co.uk",
      type: "type",
      uuid: "uuid",
    };

    expect(error).toBeNull();
    expect(manager).toEqual(expectedResponse);
    expect(inputSpy).toHaveBeenCalledWith("email", "nhs-manager@nhs.co.uk");
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

    const { manager, error } = await retrieveManagerByEmailGateway({
      getMsSqlConnPool,
      logger
    })();

    expect(manager).toBeNull();
    expect(error).toEqual("Error: DB Error!");
  });
});
