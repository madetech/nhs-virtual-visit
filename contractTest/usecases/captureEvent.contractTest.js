import captureEvent from "../../src/usecases/captureEvent";
import AppContainer from "../../src/containers/AppContainer";
import {
  setupWardWithinHospitalAndTrust,
  setupVisitPostgres,
} from "../../test/testUtils/factories";

describe("captureEvent contract tests", () => {
  const container = AppContainer.getInstance();

  it("returns an error when the event data is invalid", async () => {
    const joinRequest = {
      action: null,
      visitId: null,
      callSessionId: null,
    };

    const { event, error } = await captureEvent(container)(joinRequest);

    expect(event).toBeNull();
    expect(error).toBeDefined();
  });

  it("creates a join-visit event in the db when valid", async () => {
    const { wardId } = await setupWardWithinHospitalAndTrust();

    const { id: visitId } = await setupVisitPostgres({ wardId });

    const joinRequest = {
      action: "join-visit",
      visitId: visitId,
      callSessionId: "57033d3d-3266-4932-a5a7-144ee16cc04e",
    };

    const { event, error } = await captureEvent(container)(joinRequest);

    expect(error).toBeNull();
    expect(event).toMatchObject(joinRequest);
    expect(event.id).toBeDefined();
    expect(event.time).toBeDefined();
  });
});
