import retrieveManagersByOrgId from "../../src/usecases/retrieveManagersByOrgId";

describe("retrieveManagersByOrgId", () => {
  let container;
  const expectedOrgId = 1;
  const expectedManagers = [
    {
      email: "test1@nhs.co.uk",
      uuid: "123",
      status: 0,
    },
    {
      email: "test2@nhs.co.uk",
      uuid: "124",
      status: 1,
    },
  ];
  const dbStub = jest.fn();
  const retrieveManagersByOrgIdSpy = jest.fn(async () => expectedManagers);
  beforeEach(() => {
    container = {
      getMsSqlConnPool: () => dbStub,
      getRetrieveManagersByOrgIdGateway: () => retrieveManagersByOrgIdSpy,
    };
  });
  it("returns no error if managers can be retrieved", async () => {
    const { managers, error } = await retrieveManagersByOrgId(container)(
      expectedOrgId
    );
    expect(error).toBeNull();
    managers.map((manager, idx) =>
      expect(manager).toEqual({
        ...expectedManagers[idx],
        status: expectedManagers[idx].status === 0 ? "disabled" : "active",
      })
    );
    expect(retrieveManagersByOrgIdSpy).toBeCalledWith(dbStub, expectedOrgId);
  });
  it("returns an error if manager cannot be deleted", async () => {
    const retrieveManagersByOrgIdErrorSpy = jest.fn(async () => {
      throw new Error("error");
    });
    container = {
      ...container,
      getRetrieveManagersByOrgIdGateway: () => retrieveManagersByOrgIdErrorSpy,
    };
    const { managers, error } = await retrieveManagersByOrgId(container)(
      expectedOrgId
    );
    expect(error).toEqual("There was an error retrieving managers.");
    expect(managers).toBeNull();
    expect(retrieveManagersByOrgIdErrorSpy).toBeCalledWith(
      dbStub,
      expectedOrgId
    );
  });
  it("returns an error if orgId does not exist", async () => {
    const { managers, error } = await retrieveManagersByOrgId(container)();
    expect(error).toEqual("orgId is must be provided.");
    expect(managers).toBeNull();
  });
});
