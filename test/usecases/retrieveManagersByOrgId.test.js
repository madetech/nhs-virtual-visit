import retrieveManagersByOrgId from "../../src/usecases/retrieveManagersByOrgId";
import logger from "../../logger";


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
  const retrieveManagersByOrgIdSpy = jest.fn(() => {
    return { expectedManagers, error: null };
  });

  beforeEach(() => {
    container = {
      getRetrieveManagersByOrgIdGateway: () => retrieveManagersByOrgIdSpy,
      logger
    };
  });

  it("returns an error if there is no orgId", async () => {
    const { managers, error } = await retrieveManagersByOrgId(container)();

    expect(managers).toBeNull();
    expect(error).toEqual("orgId is not defined");
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
    expect(retrieveManagersByOrgIdSpy).toBeCalledWith(expectedOrgId);
  });

  it("returns an error if managers cannot be retrieved", async () => {
    const retrieveManagersByOrgIdErrorSpy = jest.fn(() => {
      return {
        managers: null,
        error: "error",
      };
    });

    container = {
      ...container,
      getRetrieveManagersByOrgIdGateway: () => retrieveManagersByOrgIdErrorSpy,
    };
    const { managers, error } = await retrieveManagersByOrgId(container)(
      expectedOrgId
    );

    expect(error).toEqual("error");
    expect(managers).toEqual([]);
    expect(retrieveManagersByOrgIdErrorSpy).toBeCalledWith(expectedOrgId);
  });
});
