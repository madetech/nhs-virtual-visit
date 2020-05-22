import createTrust from "./createTrust";
import AppContainer from "../containers/AppContainer";
import truncateAllTables from "../testUtils/truncateAllTables";

describe("createTrust contract tests", () => {
  const container = AppContainer.getInstance();

  beforeEach(async () => {
    await truncateAllTables(container);
  });

  afterEach(async () => {
    await truncateAllTables(container);

    const db = await container.getDb();
    db.$pool.end();
  });

  it("creates a trust in the db when valid", async () => {
    const request = {
      name: "Defoe Trust",
      adminCode: "adminCode",
    };

    const { trustId, error } = await createTrust(container)(request);

    expect(trustId).not.toBeNull();

    expect(error).toBeNull();
  });
});
