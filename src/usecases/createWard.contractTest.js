import createWard from "./createWard";
import AppContainer from "../containers/AppContainer";
import { setupTrust, setupHospital } from "../testUtils/factories";

describe("createWard contract tests", () => {
  const container = AppContainer.getInstance();

  it("creates a ward in the db when valid", async () => {
    const { trustId } = await setupTrust();

    const { hospitalId } = await setupHospital({ trustId });

    const request = {
      name: "Defoe Ward",
      hospitalName: "Test Hospital",
      code: "WardCode",
      trustId,
      hospitalId,
    };

    const { wardId, error } = await createWard(container)(request);

    const { ward } = await container.getRetrieveWardById()(wardId, trustId);

    expect(ward).toEqual({
      id: wardId,
      name: "Defoe Ward",
      hospitalId,
      hospitalName: "Test Hospital",
    });

    expect(error).toBeNull();
  });
});
