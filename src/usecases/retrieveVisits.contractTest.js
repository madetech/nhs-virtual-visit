import AppContainer from "../containers/AppContainer";
import moment from "moment";
import deleteVisitByCallId from "./deleteVisitByCallId";
import { insertVisit } from "./createVisit";
import { setupTrust } from "../testUtils/factories";

describe("retrieveVisits contract tests", () => {
  const container = AppContainer.getInstance();

  it("retrieves all Visits from the db", async () => {
    const { trustId } = await setupTrust();
    const db = await container.getDb();

    const { hospitalId } = await container.getCreateHospital()({
      name: "Test Hospital",
      trustId: trustId,
    });

    const { wardId } = await container.getCreateWard()({
      name: "Test Ward",
      code: "wardCode",
      hospitalId: hospitalId,
      trustId: trustId,
    });

    const { wardId: wardId2 } = await container.getCreateWard()({
      name: "Test Ward 2",
      code: "wardCode2",
      hospitalId: hospitalId,
      trustId: trustId,
    });

    await insertVisit(
      db,
      {
        provider: "whereby",
        callPassword: "test",
        patientName: "past visit",
        callTime: moment().subtract(2, "hours"),
        contactEmail: "contact@example.com",
        contactName: "Contact Name",
        callId: "two",
      },
      wardId
    );

    await insertVisit(
      db,
      {
        provider: "test",
        callPassword: "test",
        patientName: "future visit",
        callTime: moment().add(2, "hours"),
        contactEmail: "contact@example.com",
        contactName: "Contact Name",
        callId: "three",
      },
      wardId
    );

    // Cancelled visits are not returned
    const visitToBeCancelled = await insertVisit(
      db,
      {
        provider: "test",
        callPassword: "test",
        callId: "cancelledVisit",
        patientName: "cancelled visit",
        callTime: moment().add(2, "hours"),
        contactEmail: "contact@example.com",
        contactName: "Contact Name",
      },
      wardId
    );

    await deleteVisitByCallId(container)(visitToBeCancelled.callId);

    // Visits from other wards are not returned
    await insertVisit(
      db,
      {
        provider: "test",
        callPassword: "test",
        patientName: "different ward visit",
        callTime: moment().add(2, "hours"),
        contactEmail: "contact@example.com",
        contactName: "Contact Name",
        callId: "five",
      },
      wardId2
    );

    const { scheduledCalls } = await container.getRetrieveVisits()({ wardId });
    expect(scheduledCalls).toEqual([
      expect.objectContaining({ patientName: "past visit" }),
      expect.objectContaining({ patientName: "future visit" }),
    ]);
  });
});
