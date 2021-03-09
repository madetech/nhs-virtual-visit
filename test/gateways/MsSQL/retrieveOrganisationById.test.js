import retrieveOrganisationByIdGateway from "../../../src/gateways/MsSQL/retrieveOrganisationById";
import logger from "../../../logger"

describe("retrieveOrganisationsGateway", () => {
  it("retrieves all organisations", async () => {
    const inputSpy = jest.fn().mockReturnThis();
    const getMsSqlConnPool = jest.fn(() => {
      return {
        request: jest.fn().mockReturnThis(),
        input: inputSpy,
        query: jest.fn().mockReturnValue({
          recordset: [
            {
              id: 3,
              name: "Test Organisation",
              created_at: "01/01/2001",
              created_by: 1,
              type: "type",
              uuid: "uuid",
              status: 1,
            },
          ],
          rowsAffected: [1],
        }),
      };
    });

    const organisationId = 3;
    const { organisation, error } = await retrieveOrganisationByIdGateway({
      getMsSqlConnPool,
      logger
    })(organisationId);

    expect(error).toBeNull();
    expect(organisation.id).toEqual(3);
    expect(organisation.name).toEqual("Test Organisation");
    expect(organisation.created_at).toEqual("01/01/2001");
    expect(organisation.created_by).toEqual(1);
    expect(organisation.type).toEqual("type");
    expect(organisation.uuid).toEqual("uuid");
    expect(organisation.status).toEqual(1);
    expect(inputSpy).toHaveBeenCalledWith(
      "organisationId",
      expect.anything(),
      3
    );
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

    const { organisation, error } = await retrieveOrganisationByIdGateway({
      getMsSqlConnPool,
      logger
    })();

    expect(organisation).toBeNull();
    expect(error).toEqual("Error: DB Error!");
  });
});
