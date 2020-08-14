import captureEvent from "./captureEvent";
import AppContainer from "../containers/AppContainer";
import {
  setupWardWithinHospitalAndTrust,
  setupVisit,
} from "../testUtils/factories";

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
    const { wardId } = await setupWardWithinHospitalAndTrust();

    const { id: visitId } = await setupVisit({ wardId });

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
