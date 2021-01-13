import AppContainer from "../../../src/containers/AppContainer";
import insertHospital from "../../../src/gateways/PostgreSQL/insertHospital";
import { setupTrust } from "../../../test/testUtils/factories";

describe("insertHospital contract", () => {
  const container = AppContainer.getInstance();

  it("inserts hospital into the db", async () => {
    const { trustId } = await setupTrust();
    const { hospitalId } = await insertHospital(container)({
      name: "Test Hospital",
      trustId,
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
