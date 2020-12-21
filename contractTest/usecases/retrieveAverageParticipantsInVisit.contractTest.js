import AppContainer from "../../src/containers/AppContainer";
import {
  setupWardWithinHospitalAndTrust,
  setupTrust,
  setupVisit,
} from "../../test/testUtils/factories";
import { v4 as uuidv4 } from "uuid";

describe("retrieveAverageParticipantsInVisit contract tests", () => {
  const container = AppContainer.getInstance();

  it("returns the average number of participants in a visit for a trust", async () => {
    // A trust with a visit with 1 participant
    const { wardId } = await setupWardWithinHospitalAndTrust();

    const { id: visitId } = await setupVisit({ wardId });

    const callSessionId = uuidv4();

    await container.getCaptureEvent()({
      action: "join-visit",
      visitId,
      callSessionId,
    });

    await container.getCaptureEvent()({
      action: "leave-visit",
      visitId,
      callSessionId,
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

    const callSessionId2 = uuidv4();

    await container.getCaptureEvent()({
      action: "join-visit",
      visitId: visitId2,
      callSessionId: callSessionId2,
    });

    await container.getCaptureEvent()({
      action: "leave-visit",
      visitId: visitId2,
      callSessionId: callSessionId2,
    });

    const { id: visitId3 } = await setupVisit({
      wardId: wardId2,
      callId: "testCallId3",
    });

    const callSessionId3 = uuidv4();

    await container.getCaptureEvent()({
      action: "join-visit",
      visitId: visitId3,
      callSessionId: callSessionId3,
    });

    await container.getCaptureEvent()({
      action: "leave-visit",
      visitId: visitId3,
      callSessionId: callSessionId3,
    });

    const callSessionId4 = uuidv4();

    await container.getCaptureEvent()({
      action: "join-visit",
      visitId: visitId3,
      callSessionId: callSessionId4,
    });

    await container.getCaptureEvent()({
      action: "leave-visit",
      visitId: visitId3,
      callSessionId: callSessionId4,
    });

    const { id: visitId4 } = await setupVisit({
      wardId: wardId2,
      callId: "testCallId4",
    });

    const callSessionId5 = uuidv4();

    await container.getCaptureEvent()({
      action: "join-visit",
      visitId: visitId4,
      callSessionId: callSessionId5,
    });

    await container.getCaptureEvent()({
      action: "leave-visit",
      visitId: visitId4,
      callSessionId: callSessionId5,
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
