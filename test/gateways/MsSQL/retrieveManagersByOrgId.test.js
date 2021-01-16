import retrieveManagersByOrgIdGateway from "../../../src/gateways/MsSQL/retrieveManagersByOrgId";

// !!!!!! this is a mocked database !!!!!
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
  const inputSpy = jest.fn().mockReturnThis();
  const request = jest.fn().mockReturnThis();
  const querySpy = jest.fn().mockReturnValue({
    recordset: expectedManagers,
  });
  let dbSpy;
  beforeEach(() => {
    dbSpy = {
      request,
      input: inputSpy,
      query: querySpy,
    };
  });
  it("retrieve managers recordset in the db when valid", async () => {
    // Act
    const actualManagers = await retrieveManagersByOrgIdGateway(
      dbSpy,
      expectedOrgId
    );
    // Assert
    expect(actualManagers).toEqual(expectedManagers);
    expect(inputSpy).toHaveBeenCalledWith("orgId", expectedOrgId);
    expect(querySpy).toHaveBeenCalledWith(
      "SELECT email, uuid, status FROM dbo.[user] WHERE organisation_id = @orgId"
    );
  });
  it("throws an error if db is undefined", async () => {
    // Arrange
    dbSpy = undefined;

    // Act && Assert
    expect(
      async () => await retrieveManagersByOrgIdGateway(dbSpy, expectedOrgId)
    ).rejects.toThrow();
  });

  it("returns undefined if orgId is undefined", async () => {
    // Arrange
    const queryUndefinedSpy = jest
      .fn()
      .mockReturnValue({ recordset: undefined });
    dbSpy = {
      ...dbSpy,
      query: queryUndefinedSpy,
    };
    const undefinedOrgId = undefined;
    // Act
    const actualManagers = await retrieveManagersByOrgIdGateway(
      dbSpy,
      undefinedOrgId
    );
    // Assert
    expect(actualManagers).toBeUndefined();
  });
});
