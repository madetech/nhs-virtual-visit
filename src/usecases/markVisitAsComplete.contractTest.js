import AppContainer from "../containers/AppContainer";
import {
  setupWardWithinHospitalAndTrust,
  setupVisit,
} from "../testUtils/factories";
import { COMPLETE } from "../helpers/visitStatus";

describe("markVisitAsComplete contract tests", () => {
  const container = AppContainer.getInstance();

  it("retrieves a visit by id", async () => {
    const { wardId } = await setupWardWithinHospitalAndTrust();

    const { id } = await setupVisit({ wardId });

    const {
      id: scheduledCallId,
      error,
    } = await container.getMarkVisitAsComplete()({
      id,
      wardId,
    });

    const { scheduledCall } = await container.getRetrieveVisitById()({
      id: scheduledCallId,
      wardId,
    });

    expect(error).toBeNull();
    expect(scheduledCall).toEqual(
      expect.objectContaining({
        status: COMPLETE,
      })
    );
  });

  it("returns an error if no id is provided", async () => {
    const { error } = await container.getMarkVisitAsComplete()({ wardId: 1 });

    expect(error).toEqual("An id must be provided.");
  });

  it("returns an error if no wardId is provided", async () => {
    const { error } = await container.getMarkVisitAsComplete()({ id: 1 });

    expect(error).toEqual("A wardId must be provided.");
  });
});
