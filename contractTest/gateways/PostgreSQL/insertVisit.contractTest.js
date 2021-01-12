import AppContainer from "../../../src/containers/AppContainer";
import insertVisit from "../../../src/gateways/PostGreSQL/insertVisit";
import Database from "../../../src/gateways/Database";
import { setupTrust, setupWard } from "../../../test/testUtils/factories";

describe("insertVisit contract tests", () => {
  const container = AppContainer.getInstance();

  it("inserts visit into the db", async () => {
    const db = await Database.getInstance();

    const { trustId } = await setupTrust();
    const { wardId } = await setupWard({ trustId: trustId });

    const visit = {
      patientName: "Patient Test",
      contactEmail: "test1@testemail.com",
      contactName: "Contact Test",
      contactNumber: "07123456789",
      callTime: new Date(),
      callId: "123",
      provider: "whereby",
      callPassword: "securePassword",
    };
    await insertVisit(db, visit, wardId);

    const anotherVisit = {
      patientName: "Test Patient",
      contactEmail: "test2@testemail.com",
      contactName: "Test Contact",
      contactNumber: "07123456788",
      callTime: new Date(),
      callId: "456",
      provider: "whereby",
      callPassword: "securePassword",
    };
    await insertVisit(db, anotherVisit, wardId);

    const { scheduledCalls } = await container.getRetrieveVisits()({ wardId });
    expect(scheduledCalls).toEqual([
      expect.objectContaining({
        patientName: "Patient Test",
        recipientName: "Contact Test",
        recipientEmail: "test1@testemail.com",
        recipientNumber: "07123456789",
      }),
      expect.objectContaining({
        patientName: "Test Patient",
        recipientName: "Test Contact",
        recipientEmail: "test2@testemail.com",
        recipientNumber: "07123456788",
      }),
    ]);
  });
});
