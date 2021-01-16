import retrieveManagerByUuidGateway from "../../../src/gateways/MsSQL/retrieveManagerByUuid";

describe("retrieveManagerByUuidGateway", () => {
  const expectedUuid = "12SD";
  const expectedManager = {
    uuid: expectedUuid,
    status: 1,
  };
  const inputSpy = jest.fn().mockReturnThis();
  const request = jest.fn().mockReturnThis();
  const querySpy = jest.fn().mockReturnValue({
    recordset: [expectedManager],
  });
  let dbSpy;
  beforeEach(() => {
    dbSpy = {
      request,
      input: inputSpy,
      query: querySpy,
    };
  });
  it("retrieve manager in the db when valid", async () => {
    // Act
    const actualManager = await retrieveManagerByUuidGateway(
      dbSpy,
      expectedUuid
    );
    // Assert
    expect(actualManager).toEqual(expectedManager);
    expect(inputSpy).toHaveBeenCalledWith("uuid", expectedUuid);
    expect(querySpy).toHaveBeenCalledWith(
      "SELECT email, organisation_id, uuid, status FROM dbo.[user] WHERE uuid = @uuid"
    );
  });
  it("throws an error if db is undefined", async () => {
    // Arrange
    dbSpy = undefined;

    // Act && Assert
    expect(
      async () => await retrieveManagerByUuidGateway(dbSpy, expectedUuid)
    ).rejects.toThrow();
  });

  it("throws an error if uuid is undefined", async () => {
    // Arrange
    const queryUndefinedSpy = jest
      .fn()
      .mockReturnValue({ recordset: undefined });
    dbSpy = {
      ...dbSpy,
      query: queryUndefinedSpy,
    };
    const undefinedUuid = undefined;
    // Act && Assert
    expect(
      async () => await retrieveManagerByUuidGateway(dbSpy, undefinedUuid)
    ).rejects.toThrowError(TypeError);
  });
});
