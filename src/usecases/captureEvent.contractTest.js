import captureEvent from "./captureEvent";
import AppContainer from "../containers/AppContainer";
import { setupTrust } from "../testUtils/factories";

describe("captureEvent contract tests", () => {
  const container = AppContainer.getInstance();

  it("returns an error when the event data is invalid", async () => {
    const joinRequest = {
      action: null,
      visitId: null,
      sessionId: null,
    };

    const { event, error } = await captureEvent(container)(joinRequest);

    expect(event).toBeNull();
    expect(error).toBeDefined();
  });

  it("creates a join-visit event in the db when valid", async () => {
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
      patientName: "Bob Smith",
      contactEmail: "bob.smith@madetech.com",
      contactName: "John Smith",
      contactNumber: "07123456789",
      callTime: new Date(),
      callId: 12345,
      provider: "jitsi",
      wardId: wardId,
      callPassword: "securePassword",
    });

    const joinRequest = {
      action: "join-visit",
      visitId: visitId,
      sessionId: "57033d3d-3266-4932-a5a7-144ee16cc04e",
    };

    const { event, error } = await captureEvent(container)(joinRequest);

    expect(error).toBeNull();
    expect(event).toMatchObject(joinRequest);
    expect(event.id).toBeDefined();
    expect(event.time).toBeDefined();
  });
});
