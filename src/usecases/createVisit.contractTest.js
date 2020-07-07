import AppContainer from "../containers/AppContainer";
import { setupWardWithinHospitalAndTrust } from "../testUtils/factories";

describe("createVisit contract tests", () => {
  const container = AppContainer.getInstance();

  it("creates a visit", async () => {
    const { wardId } = await setupWardWithinHospitalAndTrust({ index: 1 });

    const visit = await container.getCreateVisit()({
      patientName: "Patient Name",
      contactEmail: "contact@example.com",
      contactName: "Contact Name",
      callTime: new Date("2020-06-01 13:00"),
      callId: "TESTCALLID",
      provider: "TESTPROVIDER",
      callPassword: "TESTCALLPASSWORD",
      wardId,
    });

    expect(visit.id).not.toBeNull();
  });
});
