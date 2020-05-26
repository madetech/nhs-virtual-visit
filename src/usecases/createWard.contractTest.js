import createWard from "./createWard";
import AppContainer from "../containers/AppContainer";
import truncateAllTables from "../testUtils/truncateAllTables";
import setupTrust from "../testUtils/setupTrust";

describe("createWard contract tests", () => {
  const container = AppContainer.getInstance();

  beforeEach(async () => {
    await truncateAllTables(container);
  });

  afterEach(async () => {
    await truncateAllTables(container);
  });

  it("creates a ward in the db when valid", async () => {
    const trust = await setupTrust(container)({
      name: "Test Trust",
      admin_code: "TEST",
    });

    const { hospitalId } = await container.getCreateHospital()({
      name: "Test Hospital",
      trustId: trust.id,
    });

    const request = {
      name: "Defoe Ward",
      hospitalName: "Test Hospital",
      code: "WardCode",
      trustId: trust.id,
      hospitalId: hospitalId,
    };

    const { wardId, error } = await createWard(container)(request);

    const { ward } = await container.getRetrieveWardById()(wardId, trust.id);

    expect(ward).toEqual({
      id: wardId,
      name: "Defoe Ward",
      hospitalId: hospitalId,
      hospitalName: "Test Hospital",
    });

    expect(error).toBeNull();
  });
});
