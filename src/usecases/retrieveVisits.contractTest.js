import AppContainer from "../containers/AppContainer";
import deleteVisitByCallId from "./deleteVisitByCallId";
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

    let pastDate = new Date();
    pastDate.setDate(pastDate.getDate() + 1);
    const pastVisit = await container.getInsertVisitGateway()(
      db,
      {
        provider: "whereby",
        callPassword: "test",
        patientName: "past visit",
        callTime: pastDate,
        contactEmail: "contact@example.com",
        contactName: "Contact Name",
        callId: "two",
      },
      wardId
    );

    let futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    const futureVisit = await container.getInsertVisitGateway()(
      db,
      {
        provider: "test",
        callPassword: "test",
        patientName: "future visit",
        callTime: futureDate,
        contactEmail: "contact2@example.com",
        contactName: "Test Name",
        contactNumber: "07899123456",
        callId: "three",
      },
      wardId
    );

    // Cancelled visits are not returned
    await container.getInsertVisitGateway()(
      db,
      {
        provider: "test",
        callPassword: "test",
        callId: "cancelledVisit",
        patientName: "cancelled visit",
        callTime: new Date(),
        contactEmail: "contact@example.com",
        contactName: "Contact Name",
      },
      wardId
    );

    await deleteVisitByCallId(container)("cancelledVisit");

    // Visits from other wards are not returned
    await container.getInsertVisitGateway()(
      db,
      {
        provider: "test",
        callPassword: "test",
        patientName: "different ward visit",
        callTime: new Date(),
        contactEmail: "contact@example.com",
        contactName: "Contact Name",
        contactNumber: "",
        callId: "five",
      },
      wardId2
    );

    const { scheduledCalls } = await container.getRetrieveVisits()({ wardId });
    expect(scheduledCalls).toEqual([
      {
        id: pastVisit.id,
        patientName: "past visit",
        recipientName: "Contact Name",
        recipientEmail: "contact@example.com",
        recipientNumber: null,
        callTime: pastDate.toISOString(),
        callId: "two",
        provider: "whereby",
        status: "scheduled",
      },
      {
        id: futureVisit.id,
        patientName: "future visit",
        recipientName: "Test Name",
        recipientEmail: "contact2@example.com",
        recipientNumber: "07899123456",
        callTime: futureDate.toISOString(),
        callId: "three",
        provider: "test",
        status: "scheduled",
      },
    ]);
  });
});
