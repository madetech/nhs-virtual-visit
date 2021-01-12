import updateHospital from "../../src/usecases/updateHospital";
import AppContainer from "../../src/containers/AppContainer";
import { setupTrust } from "../../test/testUtils/factories";

describe("updateHospital contract tests", () => {
  const container = AppContainer.getInstance();

  it("updates a hospital", async () => {
    const { trustId } = await setupTrust();

    const { hospitalId } = await container.getCreateHospital()({
      name: "Test Hospital",
      code: "TH2",
      trustId: trustId,
    });

    const request = {
      name: "Test Hospital 2",
      id: hospitalId,
      code: "TH2",
      status: "active",
      supportUrl: "https://www.support.example.com",
      surveyUrl: "https://www.survey.example.com",
    };

    const { id: updatedHospitalId, error } = await updateHospital(container)(
      request
    );

    const { hospital } = await container.getRetrieveHospitalById()(
      updatedHospitalId,
      trustId
    );

    expect(hospital).toEqual({
      code: "TH2",
      id: hospitalId,
      name: "Test Hospital 2",
      status: "active",
      supportUrl: "https://www.support.example.com",
      surveyUrl: "https://www.survey.example.com",
    });

    expect(error).toBeNull();
  });
});
