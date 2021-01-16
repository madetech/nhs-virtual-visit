import retrieveManagerByUuidGateway from "../../../src/gateways/MsSQL/retrieveManagerByUuid";
import mockMssql from "mssql";

describe("retrieveManagerByUuidGateway", () => {
  const expectedUuid = "12SD";
  const expectedManager = {
    uuid: expectedUuid,
    status: 1,
  };
  let dbSpy;
  beforeEach(() => {
    dbSpy = mockMssql.getConnectionPool();
    dbSpy.query.mockImplementation(() =>
      Promise.resolve({
        recordset: [expectedManager],
      })
    );
  });
  it("retrieve manager in the db when valid", async () => {
    // Act
    const actualManager = await retrieveManagerByUuidGateway(
      dbSpy,
      expectedUuid
    );
    // Assert
    expect(actualManager).toEqual(expectedManager);
    expect(dbSpy.input).toHaveBeenCalledTimes(1);
    expect(dbSpy.input).toHaveBeenCalledWith("uuid", expectedUuid);
    expect(dbSpy.query).toHaveBeenCalledWith(
      "SELECT email, organisation_id, uuid, status FROM dbo.[user] WHERE uuid = @uuid"
    );
  });
  it("throws an error if db is undefined", async () => {
    // Arrange
    const dbStub = undefined;

    // Act && Assert
    expect(
      async () => await retrieveManagerByUuidGateway(dbStub, expectedUuid)
    ).rejects.toThrow();
  });

  it("throws an error if uuid is undefined", async () => {
    // Arrange
    dbSpy.query.mockImplementationOnce(() =>
      Promise.resolve({
        recordset: undefined,
      })
    );
    const undefinedUuid = undefined;
    // Act && Assert
    expect(
      async () => await retrieveManagerByUuidGateway(dbSpy, undefinedUuid)
    ).rejects.toThrowError(TypeError);
  });
});
