import { setupTrust } from "../testUtils/factories";
import AppContainer from "../containers/AppContainer";

describe("updateTrust contract test", () => {
  it("updates the video provider", async () => {
    const container = AppContainer.getInstance();
    const { trustId } = await setupTrust({ videoProvider: "jitsi" });
    const updateTrust = container.getUpdateTrust();

    const { id: updatedTrustId } = await updateTrust({
      id: trustId,
      videoProvider: "whereby",
    });

    const { trust } = await container.getRetrieveTrustById()(updatedTrustId);

    expect(trust.videoProvider).toEqual("whereby");
  });

  it("returns an error if the trust doesn't exist", async () => {
    const container = AppContainer.getInstance();
    const updateTrust = container.getUpdateTrust();

    const result = await updateTrust({
      id: 12345,
      videoProvider: "whereby",
    });

    expect(result.error).not.toBeNull();
  });
});
