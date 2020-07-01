import AppContainer from "../containers/AppContainer";
import { setupTrust, setupHospital, setupWard } from "../testUtils/factories";
import { v4 as uuidv4 } from "uuid";

describe("retrieveAverageVisitsPerDay contract tests", () => {
  const container = AppContainer.getInstance();

  it("returns the average number of visits per day for a trust", async () => {
    // A trust with a visit with 1 participant
    const { trustId } = await setupTrust();

    const { hospitalId } = await setupHospital({
      name: "Test Hospital",
      trustId: trustId,
    });

    const { wardId } = await setupWard({
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

    // A trust with a visit with 1 participant, one with 2 participants and
    // another with 1 participant

    const { hospitalId: hospitalId2 } = await setupHospital({
      name: "Test Hospital 2",
      trustId: trustId,
    });

    const { wardId: wardId2 } = await setupWard({
      name: "Test Ward 2",
      code: "wardCode2",
      hospitalId: hospitalId2,
      trustId: trustId,
    });

    const { id: visitId2 } = await container.getCreateVisit()({
      patientName: "Adora",
      contactEmail: "catra@example.com",
      contactName: "Catra",
      callTime: new Date("2020-06-03 13:00"),
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
      callTime: new Date("2020-06-03 13:00"),
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

    // Has no events so shouldn't be counted
    await container.getCreateVisit()({
      patientName: "Mermista",
      contactEmail: "seahawk@example.com",
      contactName: "Seahawk",
      callTime: new Date("2020-06-03 13:00"),
      callId: "testCallId4",
      provider: "TESTPROVIDER",
      wardId: wardId2,
      callPassword: "testCallPassword",
    });

    const {
      averageVisitsPerDay,
      error,
    } = await container.getRetrieveAverageVisitsPerDay()(
      trustId,
      new Date("2020-06-03 13:00")
    );

    expect(averageVisitsPerDay).toEqual(1);
    expect(error).toBeNull();
  });

  it("returns 0 if there are no events for a trust", async () => {
    const { trustId } = await setupTrust();

    const {
      averageVisitsPerDay,
      error,
    } = await container.getRetrieveAverageVisitsPerDay()(trustId);

    expect(averageVisitsPerDay).toEqual(0);
    expect(error).toBeNull();
  });

  it("returns an error if no trustId is provided", async () => {
    const { error } = await container.getRetrieveAverageVisitsPerDay()();

    expect(error).not.toBeNull();
  });
});
