import AppContainer from "../containers/AppContainer";
import {
  setupWardWithinHospitalAndTrust,
  setupVisit,
} from "../testUtils/factories";
import { SCHEDULED } from "../helpers/visitStatus";

describe("retrieveVisitById contract tests", () => {
  const container = AppContainer.getInstance();

  it("retrieves a visit by id", async () => {
    const { wardId } = await setupWardWithinHospitalAndTrust();

    const { id } = await setupVisit({ wardId });

    const { scheduledCall, error } = await container.getRetrieveVisitById()({
      id,
      wardId,
    });

    expect(scheduledCall).toEqual({
      patientName: "Patient Name",
      recipientName: "Contact Name",
      recipientNumber: "",
      recipientEmail: "contact@example.com",
      callTime: new Date("2020-06-01 13:00"),
      callId: "TESTCALLID",
      provider: "whereby",
      callPassword: "TESTCALLPASSWORD",
      status: SCHEDULED,
      id,
    });
    expect(error).toBeNull();
  });

  it("returns an error if no id is provided", async () => {
    const { error } = await container.getRetrieveVisitById()({ wardId: 1 });

    expect(error).toEqual("An id must be provided.");
  });

  it("returns an error if no wardId is provided", async () => {
    const { error } = await container.getRetrieveVisitById()({ id: 1 });

    expect(error).toEqual("A wardId must be provided.");
  });
});
