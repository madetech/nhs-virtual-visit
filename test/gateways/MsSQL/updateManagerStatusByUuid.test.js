import updateManagerStatusByUuidGateway from "../../../src/gateways/MsSQL/updateManagerStatusByUuid";

// !!!!!! this is a mocked database !!!!!
describe("updateManagerStatusByUuidGateway", () => {
  const expectedUuid = "abc";
  const expectedStatus = 1;
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
  it("updates a managers status in the db when valid", async () => {
    // Act
    const actualUuid = await updateManagerStatusByUuidGateway(
      dbSpy,
      expectedUuid,
      expectedStatus
    );
    // Assert
    expect(actualUuid).toEqual(expectedUuid);
    expect(inputSpy).toHaveBeenNthCalledWith(1, "uuid", expectedUuid);
    expect(inputSpy).toHaveBeenNthCalledWith(2, "status", expectedStatus);
    expect(querySpy).toHaveBeenCalledWith(
      "UPDATE dbo.[user] SET status = @status OUTPUT inserted.uuid WHERE uuid = @uuid"
    );
  });
  it("throws an error if db is undefined", async () => {
    // Arrange
    dbSpy = {};

    // Act && Assert
    expect(
      async () =>
        await updateManagerStatusByUuidGateway(
          dbSpy,
          expectedUuid,
          expectedStatus
        )
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
      async () =>
        await updateManagerStatusByUuidGateway(
          dbSpy,
          undefinedUuid,
          expectedStatus
        )
    ).rejects.toThrowError(TypeError);
  });

  it("throws an error if status is undefined", async () => {
    // Arrange
    const queryUndefinedSpy = jest
      .fn()
      .mockReturnValue({ recordset: undefined });
    dbSpy = {
      ...dbSpy,
      query: queryUndefinedSpy,
    };
    const undefinedStatus = undefined;
    // Act && Assert
    expect(
      async () =>
        await updateManagerStatusByUuidGateway(
          dbSpy,
          expectedUuid,
          undefinedStatus
        )
    ).rejects.toThrowError(TypeError);
  });
});
