import retrieveActiveOrganisationsGateway from "../../../src/gateways/MsSQL/retrieveActiveOrganisations";

describe("retrieveActiveOrganisationsGateway", () => {
  it("retrieves all active organisations", async () => {
    const inputSpy = jest.fn().mockReturnThis();
    const getMsSqlConnPool = jest.fn(() => {
      return {
        request: jest.fn().mockReturnThis(),
        input: inputSpy,
        query: jest.fn().mockReturnValue({
          recordset: [
            {
              id: 1,
              name: "Test Organisation",
              created_at: "01/01/2001",
              created_by: 1,
              type: "type",
              uuid: "uuid",
              status: 1,
            },
          ],
        }),
      };
    });

    const { organisations, error } = await retrieveActiveOrganisationsGateway({
      getMsSqlConnPool,
    })();

    expect(error).toBeNull();
    expect(organisations[0].id).toEqual(1);
    expect(organisations[0].name).toEqual("Test Organisation");
    expect(organisations[0].created_at).toEqual("01/01/2001");
    expect(organisations[0].created_by).toEqual(1);
    expect(organisations[0].type).toEqual("type");
    expect(organisations[0].uuid).toEqual("uuid");
    expect(organisations[0].status).toEqual(1);
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

    const { organisations, error } = await retrieveActiveOrganisationsGateway({
      getMsSqlConnPool,
    })();

    expect(organisations).toBeNull();
    expect(error).toEqual("Error: DB Error!");
  });
});
