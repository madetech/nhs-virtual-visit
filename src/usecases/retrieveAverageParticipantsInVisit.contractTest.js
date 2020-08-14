import AppContainer from "../containers/AppContainer";
import {
  setupWardWithinHospitalAndTrust,
  setupTrust,
  setupVisit,
} from "../testUtils/factories";
import { v4 as uuidv4 } from "uuid";

describe("retrieveAverageParticipantsInVisit contract tests", () => {
  const container = AppContainer.getInstance();

  it("returns the average number of participants in a visit for a trust", async () => {
    // A trust with a visit with 1 participant
    const { wardId } = await setupWardWithinHospitalAndTrust();

    const { id: visitId } = await setupVisit({ wardId });

    const sessionId = uuidv4();

    await container.getCaptureEvent()({
      action: "join-visit",
      visitId,
      sessionId,
    });

    await container.getCaptureEvent()({
      action: "leave-visit",
      visitId,
      sessionId,
    });

    // A trust with a visit with 1 participant, one with 2 participants and
    // another with 1 participant
    const {
      trustId: trustId2,
      wardId: wardId2,
    } = await setupWardWithinHospitalAndTrust({
      trustArgs: { adminCode: "TESTCODE2" },
      wardArgs: { wardCode: "wardCode2" },
    });

    const { id: visitId2 } = await setupVisit({
      wardId: wardId2,
      callId: "testCallId2",
    });

    const sessionId2 = uuidv4();

    await container.getCaptureEvent()({
      action: "join-visit",
      visitId: visitId2,
      sessionId: sessionId2,
    });

    await container.getCaptureEvent()({
      action: "leave-visit",
      visitId: visitId2,
      sessionId: sessionId2,
    });

    const { id: visitId3 } = await setupVisit({
      wardId: wardId2,
      callId: "testCallId3",
    });

    const sessionId3 = uuidv4();

    await container.getCaptureEvent()({
      action: "join-visit",
      visitId: visitId3,
      sessionId: sessionId3,
    });

    await container.getCaptureEvent()({
      action: "leave-visit",
      visitId: visitId3,
      sessionId: sessionId3,
    });

    const sessionId4 = uuidv4();

    await container.getCaptureEvent()({
      action: "join-visit",
      visitId: visitId3,
      sessionId: sessionId4,
    });

    await container.getCaptureEvent()({
      action: "leave-visit",
      visitId: visitId3,
      sessionId: sessionId4,
    });

    const { id: visitId4 } = await setupVisit({
      wardId: wardId2,
      callId: "testCallId4",
    });

    const sessionId5 = uuidv4();

    await container.getCaptureEvent()({
      action: "join-visit",
      visitId: visitId4,
      sessionId: sessionId5,
    });

    await container.getCaptureEvent()({
      action: "leave-visit",
      visitId: visitId4,
      sessionId: sessionId5,
    });

    const {
      averageParticipantsInVisit,
      error,
    } = await container.getRetrieveAverageParticipantsInVisit()(trustId2);

    expect(averageParticipantsInVisit).toEqual(1.3);
    expect(error).toBeNull();
  });

  it("returns 0 if there are no events for a trust", async () => {
    const { trustId } = await setupTrust();

    const {
      averageParticipantsInVisit,
      error,
    } = await container.getRetrieveAverageParticipantsInVisit()(trustId);

    expect(averageParticipantsInVisit).toEqual(0);
    expect(error).toBeNull();
  });

  it("returns an error if no trustId is provided", async () => {
    const { error } = await container.getRetrieveAverageParticipantsInVisit()();

    expect(error).not.toBeNull();
  });
});
