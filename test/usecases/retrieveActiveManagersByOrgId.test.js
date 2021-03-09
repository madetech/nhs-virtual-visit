import retrieveActiveManagersByOrgId from "../../src/usecases/retrieveActiveManagersByOrgId";
import { statusToId, ACTIVE } from "../../src/helpers/statusTypes";
import logger from "../../logger";

describe("retrieveActiveManagersByOrgId", () => {
  let container;
  const expectedOrgId = 1;
  const expectedManagers = [
    {
      email: "test1@nhs.co.uk",
      uuid: "123",
      status: statusToId(ACTIVE),
    },
    {
      email: "test2@nhs.co.uk",
      uuid: "124",
      status: statusToId(ACTIVE),
    },
  ];
  const retrieveActiveManagersByOrgIdSpy = jest.fn(() => {
    return { expectedManagers, error: null };
  });

  beforeEach(() => {
    container = {
      getRetrieveActiveManagersByOrgIdGateway: () =>
        retrieveActiveManagersByOrgIdSpy,
      logger
    };
  });

  it("returns an error if there is no orgId", async () => {
    const { managers, error } = await retrieveActiveManagersByOrgId(
      container
    )();

    expect(managers).toBeNull();
    expect(error).toEqual("orgId is not defined");
  });

  it("returns no error if managers can be retrieved", async () => {
    const { managers, error } = await retrieveActiveManagersByOrgId(container)(
      expectedOrgId
    );
    expect(error).toBeNull();
    managers.map((manager, idx) =>
      expect(manager).toEqual({
        ...expectedManagers[idx],
        status: expectedManagers[idx].status === 0 ? "disabled" : "active",
      })
    );
    expect(retrieveActiveManagersByOrgIdSpy).toBeCalledWith(expectedOrgId);
  });

  it("returns an error if managers cannot be retrieved", async () => {
    const retrieveActiveManagersByOrgIdErrorSpy = jest.fn(() => {
      return {
        managers: null,
        error: "error",
      };
    });

    container = {
      ...container,
      getRetrieveActiveManagersByOrgIdGateway: () =>
        retrieveActiveManagersByOrgIdErrorSpy,
    };
    const { managers, error } = await retrieveActiveManagersByOrgId(container)(
      expectedOrgId
    );

    expect(error).toEqual("error");
    expect(managers).toEqual([]);
    expect(retrieveActiveManagersByOrgIdErrorSpy).toBeCalledWith(expectedOrgId);
  });
});
