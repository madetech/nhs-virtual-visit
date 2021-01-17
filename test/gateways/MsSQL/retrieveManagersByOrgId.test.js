import retrieveManagersByOrgIdGateway from "../../../src/gateways/MsSQL/retrieveManagersByOrgId";
import mockMssql from "src/gateways/MsSQL";

describe("retrieveManagersByOrgIdGateway", () => {
  const expectedOrgId = 1;
  const expectedManagers = [
    {
      uuid: "11123",
      status: 0,
    },
    {
      uuid: "11124",
      status: 1,
    },
  ];
  let dbSpy;
  beforeEach(() => {
    dbSpy = mockMssql.getConnectionPool();
    dbSpy.query.mockImplementation(() =>
      Promise.resolve({
        recordset: expectedManagers,
      })
    );
  });
  it("retrieve managers recordset in the db when valid", async () => {
    // Act
    const actualManagers = await retrieveManagersByOrgIdGateway(
      dbSpy,
      expectedOrgId
    );
    // Assert
    expect(actualManagers).toEqual(expectedManagers);
    expect(dbSpy.input).toHaveBeenCalledTimes(1);
    expect(dbSpy.input).toHaveBeenCalledWith("orgId", expectedOrgId);
    expect(dbSpy.query).toHaveBeenCalledWith(
      "SELECT email, uuid, status FROM dbo.[user] WHERE organisation_id = @orgId"
    );
  });
  it("throws an error if db is undefined", async () => {
    // Arrange
    const dbStub = undefined;
    // Act && Assert
    expect(
      async () => await retrieveManagersByOrgIdGateway(dbStub, expectedOrgId)
    ).rejects.toThrow();
  });

  it("returns undefined if orgId is undefined", async () => {
    // Arrange
    const undefinedOrgId = undefined;
    dbSpy.query.mockImplementationOnce(() =>
      Promise.resolve({
        recordset: undefined,
      })
    );
    // Act
    const actualManagers = await retrieveManagersByOrgIdGateway(
      dbSpy,
      undefinedOrgId
    );
    // Assert
    expect(actualManagers).toBeUndefined();
  });
});
