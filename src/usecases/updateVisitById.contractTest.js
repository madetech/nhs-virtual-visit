import AppContainer from "../containers/AppContainer";
import {
  setupWardWithinHospitalAndTrust,
  setupVisit,
} from "../testUtils/factories";

describe("updateVisitById contract tests", () => {
  const container = AppContainer.getInstance();

  it("updates the details of a visit", async () => {
    const { wardId } = await setupWardWithinHospitalAndTrust();
    const { id } = await setupVisit({ wardId });

    const { visit, error } = await container.getUpdateVisitById()({
      id,
      patientName: "Aang",
      recipientName: "Katara",
      recipientEmail: "katara@example.com",
      recipientNumber: "07123456789",
      callTime: new Date("2020-08-01 18:00"),
    });

    expect(visit.patientName).toEqual("Aang");
    expect(visit.recipientName).toEqual("Katara");
    expect(visit.recipientEmail).toEqual("katara@example.com");
    expect(visit.recipientNumber).toEqual("07123456789");
    expect(visit.callTime).toEqual(new Date("2020-08-01 18:00"));
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
