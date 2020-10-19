import AppContainer from "../containers/AppContainer";
import { setupWardWithinHospitalAndTrust } from "../testUtils/factories";

describe("createVisit contract tests", () => {
  const container = AppContainer.getInstance();

  it("creates a visit", async () => {
    const { wardId, trustId } = await setupWardWithinHospitalAndTrust({
      index: 1,
    });

    let date = new Date();
    date.setDate(date.getDate() + 1);

    const { success } = await container.getCreateVisit()(
      {
        patientName: "Patient Name",
        contactEmail: "contact@example.com",
        contactName: "Contact Name",
        callTime: date,
        callId: "two",
        provider: "jitsi",
        callPassword: "DAVE",
      },
      wardId,
      trustId
    );

    expect(success).toEqual(true);
  });
});
