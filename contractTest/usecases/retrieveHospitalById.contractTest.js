import AppContainer from "../../src/containers/AppContainer";
import { setupTrust, setupHospital } from "../../test/testUtils/factories";

describe("retrieveHospitalById contract tests", () => {
  const container = AppContainer.getInstance();

  it("returns a hospital", async () => {
    const { trustId } = await setupTrust();

    const { hospitalId } = await setupHospital({
      name: "Test Hospital",
      trustId: trustId,
      code: "TTH",
      surveyUrl: "https://www.survey.example.com",
      supportUrl: "https://www.support.example.com",
    });

    const { hospital, error } = await container.getRetrieveHospitalById()(
      hospitalId,
      trustId
    );

    expect(hospital).toEqual({
      id: hospitalId,
      name: "Test Hospital",
      code: "TTH",
      status: "active",
      surveyUrl: "https://www.survey.example.com",
      supportUrl: "https://www.support.example.com",
    });
    expect(error).toBeNull();
  });
});
