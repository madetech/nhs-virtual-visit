import activateManagerAndOrganisationGateway from "../../../src/gateways/MsSQL/activateManagerAndOrganisation";

describe("activateManagerAndOrganisationGateway", () => {
  it("activates the manager and organisation", async () => {
    const inputSpy = jest.fn().mockReturnThis();
    const getMsSqlConnPool = jest.fn(() => {
      return {
        request: jest.fn().mockReturnThis(),
        input: inputSpy,
        query: jest.fn().mockReturnValue({
          recordset: [
            {
              name: "test organisation",
              organisation_id: 1,
            },
          ],
        }),
      };
    });

    const inputObj = {
      userId: 1,
      organisationId: 1,
      verified: true,
      status: 1,
    };

    const { organisation, error } = await activateManagerAndOrganisationGateway(
      {
        getMsSqlConnPool,
      }
    )(inputObj);

    const expectedResponse = {
      name: "test organisation",
      organisation_id: 1,
    };

    expect(error).toBeNull();
    expect(organisation).toEqual(expectedResponse);
    expect(inputSpy).toHaveBeenCalledWith("userId", 1);
    expect(inputSpy).toHaveBeenCalledWith("organisationId", 1);
    expect(inputSpy).toHaveBeenCalledWith("verified", true);
    expect(inputSpy).toHaveBeenCalledWith("status", 1);
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
      userId: 1,
      organisationId: 1,
      verified: true,
      status: 1,
    };

    const { organisation, error } = await activateManagerAndOrganisationGateway(
      {
        getMsSqlConnPool,
      }
    )(inputObj);

    expect(organisation).toBeNull();
    expect(error).toEqual("Error: DB Error!");
  });
});
