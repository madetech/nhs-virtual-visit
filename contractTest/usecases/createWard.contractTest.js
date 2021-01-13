import AppContainer from "../../src/containers/AppContainer";
import { setupTrust, setupHospital } from "../../test/testUtils/factories";

describe("createWard contract tests", () => {
  const container = AppContainer.getInstance();

  it("creates a ward in the db when valid", async () => {
    const { trustId } = await setupTrust();

    const { hospitalId } = await setupHospital({ trustId });

    const request = {
      name: "Defoe Ward",
      code: "WardCode",
      pin: "1234",
      trustId: trustId,
      hospitalId: hospitalId,
    };

    const { wardId, error } = await container.getCreateWard()(request);

    const { ward } = await container.getRetrieveWardById()(wardId, trustId);

    expect(ward).toEqual({
      id: wardId,
      name: "Defoe Ward",
      hospitalId,
      hospitalName: "Test Hospital",
      status: "active",
    });

    expect(error).toBeNull();
  });
});
