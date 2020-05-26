import createTrust from "./createTrust";
import AppContainer from "../containers/AppContainer";
import truncateAllTables from "../testUtils/truncateAllTables";

describe("createTrust contract tests", () => {
  const container = AppContainer.getInstance();
  const retrieveTrustById = container.getRetrieveTrustById();

  beforeEach(async () => {
    await truncateAllTables(container);
  });

  afterEach(async () => {
    await truncateAllTables(container);
  });

  it("creates a trust in the db when valid", async () => {
    const request = {
      name: "Defoe Trust",
      adminCode: "adminCode",
    };

    const { trustId, error } = await createTrust(container)(request);

    const { trust } = await retrieveTrustById(trustId);

    expect(trust).toEqual({
      id: trustId,
      name: request.name,
    });

    expect(error).toBeNull();
  });
});
