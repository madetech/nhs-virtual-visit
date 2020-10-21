import AppContainer from "../containers/AppContainer";
import insertVisit from "./insertVisit";
import Database from "./Database";
import { setupTrust, setupWard } from "../testUtils/factories";

describe("insertVisit contract tests", () => {
  const container = AppContainer.getInstance();

  it("inserts visit into the db", async () => {
    const db = await Database.getInstance();

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
    await insertVisit(db, visit, wardId);

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
    await insertVisit(db, anotherVisit, wardId);

    const { scheduledCalls } = await container.getRetrieveVisits()({ wardId });
    expect(scheduledCalls).toEqual([
      expect.objectContaining({ patientName: "Patient Test" }),
      expect.objectContaining({ patientName: "Test Patient" }),
    ]);
  });
});
