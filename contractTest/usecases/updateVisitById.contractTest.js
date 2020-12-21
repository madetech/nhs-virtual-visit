import AppContainer from "../../src/containers/AppContainer";
import {
  setupWardWithinHospitalAndTrust,
  setupVisit,
} from "../../test/testUtils/factories";

describe("updateVisitById contract tests", () => {
  const container = AppContainer.getInstance();

  it("updates the details of a visit", async () => {
    const { wardId } = await setupWardWithinHospitalAndTrust();
    const { id } = await setupVisit({ wardId });

    await container.getUpdateVisitById()({
      id,
      patientName: "Aang",
      recipientName: "Katara",
      recipientEmail: "katara@example.com",
      recipientNumber: "07123456789",
      callTime: new Date("2020-08-01 18:00"),
    });

    const { scheduledCall, error } = await container.getRetrieveVisitById()({
      id,
      wardId,
    });

    expect(scheduledCall.patientName).toEqual("Aang");
    expect(scheduledCall.recipientName).toEqual("Katara");
    expect(scheduledCall.recipientEmail).toEqual("katara@example.com");
    expect(scheduledCall.recipientNumber).toEqual("07123456789");
    expect(scheduledCall.callTime).toEqual(new Date("2020-08-01 18:00"));
    expect(error).toBeNull();
  });

  it("returns an error if visit doesn't exisit", async () => {
    await setupWardWithinHospitalAndTrust();

    const { visit, error } = await container.getUpdateVisitById()({
      id: "4321",
      patientName: "Aang",
      recipientName: "Katara",
      recipientEmail: "katara@example.com",
      recipientNumber: "07123456789",
      callTime: new Date("2020-08-01 18:00"),
    });

    expect(visit).toBeNull();
    expect(error).not.toBeNull();
  });
});
