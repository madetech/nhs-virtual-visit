import createWard from "./createWard";
import AppContainer from "../containers/AppContainer";

describe("createWard contract tests", () => {
  const container = AppContainer.getInstance();

  it("creates a ward in the db when valid", async () => {
    const { trustId } = await container.getCreateTrust()({
      name: "Test Trust",
      adminCode: "TEST",
    });

    const { hospitalId } = await container.getCreateHospital()({
      name: "Test Hospital",
      trustId: trustId,
    });

    const request = {
      name: "Defoe Ward",
      hospitalName: "Test Hospital",
      code: "WardCode",
      trustId: trustId,
      hospitalId: hospitalId,
    };

    const { wardId, error } = await createWard(container)(request);

    const { ward } = await container.getRetrieveWardById()(wardId, trustId);

    expect(ward).toEqual({
      id: wardId,
      name: "Defoe Ward",
      hospitalId: hospitalId,
      hospitalName: "Test Hospital",
    });

    expect(error).toBeNull();
  });
});
