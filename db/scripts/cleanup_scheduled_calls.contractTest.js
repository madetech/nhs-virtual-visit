const { cleanupScheduledCalls } = require("./cleanup_scheduled_calls");
import AppContainer from "../../src/containers/AppContainer";
import moment from "moment";
import {
  setupTrust,
  setupHospital,
  setupWard,
  setupVisit,
} from "../../test/testUtils/factories";
import { COMPLETE } from "../../src/helpers/visitStatus";

describe("test cleanup script", () => {
  it("updates visit states and data correctly", async () => {
    const container = AppContainer.getInstance();

    const { trustId } = await setupTrust();

    const { hospitalId } = await setupHospital({ trustId: trustId });

    const { wardId } = await setupWard({
      code: "wardCode1",
      hospitalId: hospitalId,
      trustId: trustId,
    });

    // Scheduled visit
    await setupVisit({
      callTime: moment(),
      callId: "1",
      wardId: wardId,
    });
    //

    // Scheduled visit in the past
    const { id: pastVisitId } = await setupVisit({
      callTime: moment().subtract(5, "days"),
      callId: "2",
      wardId: wardId,
    });
    //

    // Deleted visit
    await setupVisit({
      callTime: moment(),
      callId: "3",
      wardId: wardId,
    });

    await container.getDeleteVisitByCallId()("3");
    //

    // Archived visit
    const { wardId: archiveWardId } = await setupWard({
      code: "wardCode2",
      hospitalId: hospitalId,
      trustId: trustId,
    });

    await setupVisit({
      callTime: moment(),
      callId: "4",
      wardId: archiveWardId,
    });

    await container.getArchiveWard()(archiveWardId, trustId);
    //

    // Completed visit
    const { id: completeVisitId } = await setupVisit({
      callTime: moment(),
      callId: "5",
      wardId: wardId,
      status: COMPLETE,
    });

    await container.getMarkVisitAsComplete()({
      id: completeVisitId,
      wardId: wardId,
    });
    //

    // Completed visit in the past
    const { id: pastCompleteVisitId } = await setupVisit({
      callTime: moment().subtract(5, "days"),
      callId: "6",
      wardId: wardId,
      status: COMPLETE,
    });

    await container.getMarkVisitAsComplete()({
      id: pastCompleteVisitId,
      wardId: wardId,
    });
    //

    const res = await cleanupScheduledCalls();
    expect(res).toEqual({ archived: 1, cancelled: 1, completed: 2 });

    // future visit still scheduled and can be retrieved
    const futureVisit = await container.getRetrieveVisitByCallId()("1");
    expect(futureVisit.error).toBeNull();

    // past visit is now complete and cannot be retrieved
    const pastVisit = await container.getRetrieveVisitByCallId()("2");
    expect(pastVisit.scheduledCall).toBeNull();

    // past visit is now complete and cannot be retrieved
    const pastVisitById = await container.getRetrieveVisitById()({
      id: pastVisitId,
      wardId: wardId,
    });
    expect(pastVisitById.scheduledCall).toBeNull();

    // cancelled visit cannot be retrieved
    const cancelledVisit = await container.getRetrieveVisitByCallId()("3");
    expect(cancelledVisit.scheduledCall).toBeNull();

    // archived visit cannot be retrieved
    const archivedVisit = await container.getRetrieveVisitByCallId()("4");
    expect(archivedVisit.scheduledCall).toBeNull();

    // present complete visit can still be retrieved
    const completeVisit = await container.getRetrieveVisitById()({
      id: completeVisitId,
      wardId: wardId,
    });
    expect(completeVisit.error).toBeNull();

    // past complete visit cannot be retrieved
    const pastCompleteVisit = await container.getRetrieveVisitById()({
      id: pastCompleteVisitId,
      wardId: wardId,
    });
    expect(pastCompleteVisit.scheduledCall).toBeNull();

    // Only the future visit and complete visit are retrieved when retrieving all visits
    const { scheduledCalls: visits } = await container.getRetrieveVisits()({
      wardId,
    });
    expect(visits.map((visit) => visit.callId)).toEqual(["1", "5"]);
  });
});
