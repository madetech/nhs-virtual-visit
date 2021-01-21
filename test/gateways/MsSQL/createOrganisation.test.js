import createOrganisationGateway from "../../../src/gateways/MsSQL/createOrganisation";

describe("createOrganisationsGateway", () => {
  it("adds a new organisation to the database", async () => {
    const inputSpy = jest.fn().mockReturnThis();
    const getMsSqlConnPool = jest.fn(() => {
      return {
        request: jest.fn().mockReturnThis(),
        input: inputSpy,
        query: jest.fn().mockReturnValue({
          recordset: [
            {
              id: 1,
              name: "Added Trust",
              type: "trust",
              created_by: 1,
              status: 0,
            },
          ],
        }),
      };
    });

    const newOrganisation = {
      name: "Added Trust",
      type: "trust",
      createdBy: 1,
    };
    const { organisation, error } = await createOrganisationGateway({
      getMsSqlConnPool,
    })(newOrganisation);

    expect(error).toBeNull();
    expect(organisation.id).toEqual(1);
    expect(organisation.name).toEqual("Added Trust");
    expect(organisation.created_by).toEqual(1);
    expect(organisation.type).toEqual("trust");
    expect(organisation.status).toEqual(0);
    expect(inputSpy).toHaveBeenCalledWith("name", "Added Trust");
    expect(inputSpy).toHaveBeenCalledWith("type", "trust");
    expect(inputSpy).toHaveBeenCalledWith("createdBy", 1);
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

    const newOrganisation = {
      name: "Added Trust",
      type: "trust",
      createdBy: 1,
    };

    const { organisation, error } = await createOrganisationGateway({
      getMsSqlConnPool,
    })(newOrganisation);

    expect(organisation).toBeNull();
    expect(error).toEqual("Error: DB Error!");
  });
});
