import AppContainer from "../containers/AppContainer";
import { setupTrust } from "../testUtils/factories";

describe("createHospital contract tests", () => {
  const container = AppContainer.getInstance();

  it("creates a valid hospital", async () => {
    const { trustId } = await setupTrust();

    const { hospitalId } = await container.getCreateHospital()({
      trustId,
      name: "Test Hospital",
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
      supportUrl: "https://www.support.example.com",
      surveyUrl: "https://www.survey.example.com",
    });
  });
});
