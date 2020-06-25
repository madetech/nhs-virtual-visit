import AppContainer from "../containers/AppContainer";
import { setupTrust } from "../testUtils/factories";
import { v4 as uuidv4 } from "uuid";

describe("retrieveAverageParticipantsInVisit contract tests", () => {
  const container = AppContainer.getInstance();

  it("returns all the average number of participants in a visit for a trust", async () => {
    // A trust with a visit with 1 participant
    const { trustId } = await setupTrust();

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

    const { id: visitId } = await container.getCreateVisit()({
      patientName: "Glimmer",
      contactEmail: "bow@example.com",
      contactName: "Bow",
      callTime: new Date("2020-06-01 13:00"),
      callId: "testCallId",
      provider: "TESTPROVIDER",
      wardId: wardId,
      callPassword: "testCallPassword",
    });

    const sessionId = uuidv4();

    await container.getCaptureEvent()({
      action: "join-visit",
      visitId,
      sessionId,
    });

    await container.getCaptureEvent()({
      action: "leave-visit",
      visitId: visitId,
      sessionId,
    });

    // A trust with a visit with 1 participant and another with 2 participants
    const { trustId: trustId2 } = await setupTrust({ adminCode: "TESTCODE2" });

    const { hospitalId: hospitalId2 } = await container.getCreateHospital()({
      name: "Test Hospital 2",
      trustId: trustId2,
    });

    const { wardId: wardId2 } = await container.getCreateWard()({
      name: "Test Ward 2",
      code: "wardCode2",
      hospitalId: hospitalId2,
      trustId: trustId2,
    });

    const { id: visitId2 } = await container.getCreateVisit()({
      patientName: "Adora",
      contactEmail: "catra@example.com",
      contactName: "Catra",
      callTime: new Date("2020-06-01 13:00"),
      callId: "testCallId2",
      provider: "TESTPROVIDER",
      wardId: wardId2,
      callPassword: "testCallPassword",
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

    const { id: visitId3 } = await container.getCreateVisit()({
      patientName: "Scorpia",
      contactEmail: "perfuma@example.com",
      contactName: "Perfuma",
      callTime: new Date("2020-06-01 13:00"),
      callId: "testCallId3",
      provider: "TESTPROVIDER",
      wardId: wardId2,
      callPassword: "testCallPassword",
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

    const {
      averageParticipantsInVisit,
      error,
    } = await container.getRetrieveAverageParticipantsInVisit()(trustId2);

    expect(averageParticipantsInVisit).toEqual(1.5);
    expect(error).toBeNull();
  });

  it("returns an error if no trustId is provided", async () => {
    const { error } = await container.getRetrieveAverageParticipantsInVisit()();

    expect(error).not.toBeNull();
  });
});
