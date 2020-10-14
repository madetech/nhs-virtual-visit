import AppContainer from "../containers/AppContainer";
import { setupTrust, setupWard } from "../testUtils/factories";

describe("insertVisit contract tests", () => {
  const container = AppContainer.getInstance();

  it("inserts visit into the db", async () => {
    const db = await container.getDb();

    const { trustId } = await setupTrust();
    const { wardId } = await setupWard({ trustId: trustId });

    const visit = {
      patientName: "Patient Test",
      contactEmail: "test@testemail.com",
      contactName: "Contact Test",
      contactNumber: "07123456789",
      callTime: new Date(),
      callId: "123",
      provider: "jitsi",
      callPassword: "securePassword",
    };
    await container.getInsertVisitGateway()(db, visit, wardId);

    const anotherVisit = {
      patientName: "Test Patient",
      contactEmail: "test@testemail.com",
      contactName: "Test Contact",
      contactNumber: "07123456789",
      callTime: new Date(),
      callId: "456",
      provider: "jitsi",
      callPassword: "securePassword",
    };
    await container.getInsertVisitGateway()(db, anotherVisit, wardId);

    const { scheduledCalls } = await container.getRetrieveVisits()({ wardId });
    expect(scheduledCalls).toEqual([
      expect.objectContaining({ patientName: "Patient Test" }),
      expect.objectContaining({ patientName: "Test Patient" }),
    ]);
  });
});
