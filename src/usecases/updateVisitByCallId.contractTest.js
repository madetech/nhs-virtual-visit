import AppContainer from "../containers/AppContainer";
import {
  setupWardWithinHospitalAndTrust,
  setupVisit,
} from "../testUtils/factories";

describe("updateVisitByCallId contract tests", () => {
  const container = AppContainer.getInstance();

  it("updates the details of a visit", async () => {
    const { wardId } = await setupWardWithinHospitalAndTrust();
    const { callId } = await setupVisit({ wardId });

    const { visit, error } = await container.getUpdateVisitByCallId()({
      callId,
      patientName: "Aang",
      contactName: "Katara",
      contactEmail: "katara@example.com",
      contactNumber: "07123456789",
      callTime: new Date("2020-08-01 18:00"),
    });

    expect(visit.patientName).toEqual("Aang");
    expect(visit.contactName).toEqual("Katara");
    expect(visit.contactEmail).toEqual("katara@example.com");
    expect(visit.contactNumber).toEqual("07123456789");
    expect(visit.callTime).toEqual(new Date("2020-08-01 18:00"));
    expect(error).toBeNull();
  });

  it("returns an error if visit doesn't exisit", async () => {
    await setupWardWithinHospitalAndTrust();

    const { visit, error } = await container.getUpdateVisitByCallId()({
      callId: "fakeCallId",
      patientName: "Aang",
      contactName: "Katara",
      contactEmail: "katara@example.com",
      contactNumber: "07123456789",
      callTime: new Date("2020-08-01 18:00"),
    });

    expect(visit).toBeNull();
    expect(error).not.toBeNull();
  });
});
