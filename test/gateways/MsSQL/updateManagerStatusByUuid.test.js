import updateManagerStatusByUuidGateway from "../../../src/gateways/MsSQL/updateManagerStatusByUuid";
import mockMssql from "mssql";

describe("updateManagerStatusByUuidGateway", () => {
  const expectedUuid = "abc";
  const expectedStatus = 1;
  let dbSpy;
  beforeEach(() => {
    dbSpy = mockMssql.getConnectionPool();
    dbSpy.query.mockImplementation(() =>
      Promise.resolve({
        recordset: [{ uuid: expectedUuid }],
      })
    );
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
    expect(dbSpy.input).toHaveBeenCalledTimes(2);
    expect(dbSpy.input).toHaveBeenNthCalledWith(1, "uuid", expectedUuid);
    expect(dbSpy.input).toHaveBeenNthCalledWith(2, "status", expectedStatus);
    expect(dbSpy.query).toHaveBeenCalledWith(
      "UPDATE dbo.[user] SET status = @status OUTPUT inserted.uuid WHERE uuid = @uuid"
    );
  });
  it("throws an error if db is undefined", async () => {
    // Arrange
    const dbStub = undefined;
    // Act && Assert
    expect(
      async () =>
        await updateManagerStatusByUuidGateway(
          dbStub,
          expectedUuid,
          expectedStatus
        )
    ).rejects.toThrow();
  });

  it("throws an error if uuid is undefined", async () => {
    // Arrange
    const undefinedUuid = undefined;
    dbSpy.query.mockImplementationOnce(() =>
      Promise.resolve({
        recordset: undefined,
      })
    );
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
    const undefinedStatus = undefined;
    dbSpy.query.mockImplementationOnce(() =>
      Promise.resolve({
        recordset: undefined,
      })
    );
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
