const { cleanupScheduledCalls } = require("./cleanup_scheduled_calls");
import AppContainer from "../../src/containers/AppContainer";
import moment from "moment";

describe("test cleanup script", () => {
  it("updates visit states and data correctly", async () => {
    const container = AppContainer.getInstance();

    const { trustId } = await container.getCreateTrust()({
      name: "Test Trust",
      adminCode: "TEST",
    });

    const { hospitalId } = await container.getCreateHospital()({
      name: "Test Hospital",
      trustId: trustId,
    });

    const { wardId } = await container.getCreateWard()({
      name: "Test Ward 1",
      code: "wardCode1",
      hospitalId: hospitalId,
      trustId: trustId,
    });

    await container.getCreateVisit()({
      patientName: "Bob Smith",
      contactEmail: "bob.smith@madetech.com",
      contactName: "John Smith",
      contactNumber: "07123456789",
      callTime: moment(),
      callId: "1",
      provider: "jitsi",
      wardId: wardId,
      callPassword: "securePassword",
    });

    await container.getCreateVisit()({
      patientName: "Bob Smith",
      contactEmail: "bob.smith@madetech.com",
      contactName: "John Smith",
      contactNumber: "07123456789",
      callTime: moment().subtract(5, "days"),
      callId: "2",
      provider: "jitsi",
      wardId: wardId,
      callPassword: "securePassword",
    });

    await container.getCreateVisit()({
      patientName: "Bob Smith",
      contactEmail: "bob.smith@madetech.com",
      contactName: "John Smith",
      contactNumber: "07123456789",
      callTime: moment(),
      callId: "3",
      provider: "jitsi",
      wardId: wardId,
      callPassword: "securePassword",
    });

    await container.getDeleteVisitByCallId()("3");

    const { wardId: archiveWardId } = await container.getCreateWard()({
      name: "Test Ward 2",
      code: "wardCode2",
      hospitalId: hospitalId,
      trustId: trustId,
    });

    await container.getCreateVisit()({
      patientName: "Bob Smith",
      contactEmail: "bob.smith@madetech.com",
      contactName: "John Smith",
      contactNumber: "07123456789",
      callTime: moment(),
      callId: "4",
      provider: "jitsi",
      wardId: archiveWardId,
      callPassword: "securePassword",
    });

    await container.getArchiveWard()(archiveWardId, trustId);

    const res = await cleanupScheduledCalls();
    expect(res).toEqual({ archived: 1, cancelled: 1, completed: 1 });

    // future visit still scheduled and can be retrieved
    const futureVisit = await container.getRetrieveVisitByCallId()("1");
    expect(futureVisit.error).toBeNull();

    // past visit is now complete and cannot be retrieved
    const pastVisit = await container.getRetrieveVisitByCallId()("2");
    expect(pastVisit.scheduledCalls).toBeNull();

    // cancelled visit cannot be retrieved
    const cancelledVisit = await container.getRetrieveVisitByCallId()("3");
    expect(cancelledVisit.scheduledCalls).toBeNull();

    // archived visit cannot be retrieved
    const archivedVisit = await container.getRetrieveVisitByCallId()("4");
    expect(archivedVisit.scheduledCalls).toBeNull();
  });
});
