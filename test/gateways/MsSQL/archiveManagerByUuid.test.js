import archiveManagerByUuidGateway from "../../../src/gateways/MsSQL/archiveManagerByUuid";

describe("archiveManagerByUuidGateway", () => {
  const expectedUuid = "abc";
  const inputSpy = jest.fn().mockReturnThis();
  const request = jest.fn().mockReturnThis();
  const querySpy = jest.fn().mockReturnValue({
    recordset: [{ uuid: expectedUuid }],
  });
  let dbSpy;
  beforeEach(() => {
    dbSpy = {
      request,
      input: inputSpy,
      query: querySpy,
    };
  });
  it("deletes a managers status in the db when valid", async () => {
    // Act
    const actualUuid = await archiveManagerByUuidGateway(dbSpy, expectedUuid);
    // Assert
    expect(actualUuid).toEqual(expectedUuid);
    expect(inputSpy).toHaveBeenCalledWith("uuid", expectedUuid);
    expect(querySpy).toHaveBeenCalledWith(
      "DELETE FROM dbo.[user] OUTPUT deleted.uuid WHERE uuid = @uuid"
    );
  });
  it("throws an error if db is undefined", async () => {
    // Arrange
    dbSpy = undefined;

    // Act && Assert
    expect(
      async () => await archiveManagerByUuidGateway(dbSpy, expectedUuid)
    ).rejects.toThrow();
  });

  it("throws an error if uuid is undefined", async () => {
    // Arrange
    const undefinedUuid = undefined;
    const queryUndefinedStub = jest
      .fn()
      .mockReturnValue({ recordset: undefined });
    dbSpy = {
      ...dbSpy,
      query: queryUndefinedStub,
    };

    // Act && Assert
    expect(
      async () => await archiveManagerByUuidGateway(dbSpy, undefinedUuid)
    ).rejects.toThrowError(TypeError);
  });
});
