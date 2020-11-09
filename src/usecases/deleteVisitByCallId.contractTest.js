import AppContainer from "../containers/AppContainer";
import deleteVisitByCallId from "./deleteVisitByCallId";
import { setupTrust, setupWard, setupVisit } from "../testUtils/factories";

describe("deleteVisitByCallId contract tests", () => {
  const container = AppContainer.getInstance();

  it("deletes visit from the db", async () => {
    const { trustId } = await setupTrust();
    const { wardId } = await setupWard({ trustId: trustId });

    await setupVisit({ wardId, callId: "CALLID" });
    await setupVisit({
      wardId,
      patientName: "Test patient",
      callId: "TESTCALLID2",
    });

    const { scheduledCalls } = await container.getRetrieveVisits()({ wardId });
    expect(scheduledCalls).toEqual([
      expect.objectContaining({ patientName: "Patient Name" }),
      expect.objectContaining({ patientName: "Test patient" }),
    ]);

    await container.getDeleteVisitByCallId()("CALLID");

    const {
      scheduledCalls: scheduledCallsAfterDelete,
    } = await container.getRetrieveVisits()({ wardId });
    expect(scheduledCallsAfterDelete).toEqual([
      expect.objectContaining({ patientName: "Test patient" }),
    ]);
  });

  it("gracefully handles when visit does not exist for callId provided", async () => {
    const { trustId } = await setupTrust();
    const { wardId } = await setupWard({ trustId: trustId });

    await setupVisit({ wardId });

    const { scheduledCalls } = await container.getRetrieveVisits()({ wardId });
    expect(scheduledCalls).toEqual([
      expect.objectContaining({ patientName: "Patient Name" }),
    ]);

    await deleteVisitByCallId(container)("RANDOMCALLID");

    const {
      scheduledCalls: scheduledCallsAfterDelete,
    } = await container.getRetrieveVisits()({ wardId });
    expect(scheduledCallsAfterDelete).toEqual([
      expect.objectContaining({ patientName: "Patient Name" }),
    ]);
  });
});
