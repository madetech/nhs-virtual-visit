import AppContainer from "../../src/containers/AppContainer";
import {
  setupVisit,
  setupWardWithinHospitalAndTrust,
} from "../../test/testUtils/factories";

describe("retrieveSupportUrlByCallId contract tests", () => {
  const container = AppContainer.getInstance();

  it("returns support URL for a hospital of a visit", async () => {
    const callId = "callId1";

    const { wardId } = await setupWardWithinHospitalAndTrust({
      hospitalArgs: { supportUrl: "https://www.support.example.com" },
    });

    await setupVisit({ wardId, callId });

    const {
      supportUrl,
      error,
    } = await container.getRetrieveSupportUrlByCallId()(callId);

    expect(supportUrl).toEqual("https://www.support.example.com");
    expect(error).toBeNull();
  });

  it("returns null if hospital doesn't have a support link", async () => {
    const callId = "callId1";

    const { wardId } = await setupWardWithinHospitalAndTrust({
      hospitalArgs: { supportUrl: null },
    });

    await setupVisit({ wardId, callId });

    const {
      supportUrl,
      error,
    } = await container.getRetrieveSupportUrlByCallId()(callId);

    expect(supportUrl).toBeNull();
    expect(error).toBeNull();
  });

  it("returns an error if no callId is provided", async () => {
    const { error } = await container.getRetrieveSupportUrlByCallId()();

    expect(error).not.toBeNull();
  });
});
