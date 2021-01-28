import updateLinkStatusByHashGateway from "../../../src/gateways/MsSQL/updateLinkStatusByHash";

describe("updateLinkStatusByHashGateway", () => {
  it("updates the link status", async () => {
    const inputSpy = jest.fn().mockReturnThis();
    const getMsSqlConnPool = jest.fn(() => {
      return {
        request: jest.fn().mockReturnThis(),
        input: inputSpy,
        query: jest.fn().mockReturnValue({
          recordset: [
            {
              id: 1,
              hash: "hash",
              type: "confirmRegistration",
              verified: true,
            },
          ],
        }),
      };
    });

    const inputObj = {
      hash: "hash",
      verified: true,
    };

    const { userVerification, error } = await updateLinkStatusByHashGateway({
      getMsSqlConnPool,
    })(inputObj);

    const expectedResponse = {
      id: 1,
      hash: "hash",
      type: "confirmRegistration",
      verified: true,
    };

    expect(error).toBeNull();
    expect(userVerification).toEqual(expectedResponse);
    expect(inputSpy).toHaveBeenCalledWith("hash", "hash");
    expect(inputSpy).toHaveBeenCalledWith("verified", true);
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

    const inputObj = {
      hash: "hash",
      verified: true,
    };

    const { userVerification, error } = await updateLinkStatusByHashGateway({
      getMsSqlConnPool,
    })(inputObj);

    expect(userVerification).toBeNull();
    expect(error).toEqual("Error: DB Error!");
  });
});
