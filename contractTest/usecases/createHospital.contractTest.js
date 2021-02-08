import AppContainer from "../../src/containers/AppContainer";
import { setupTrust } from "../../test/testUtils/factories";

describe.skip("createHospital contract tests", () => {
  const container = AppContainer.getInstance();

  it("creates a valid hospital", async () => {
    const { trustId } = await setupTrust();
    const { hospitalId } = await container.getCreateHospital()({
      name: "Test Hospital",
      trustId: trustId,
      code: "TH1",
      supportUrl: "https://www.support.example.com",
      surveyUrl: "https://www.survey.example.com",
    });

    const { hospital, error } = await container.getRetrieveHospitalById()(
      hospitalId,
      trustId
    );

    expect(error).toBeNull();
    expect(hospital).toEqual({
      id: hospitalId,
      name: "Test Hospital",
      status: "active",
      code: "TH1",
      supportUrl: "https://www.support.example.com",
      surveyUrl: "https://www.survey.example.com",
    });
  });
});
