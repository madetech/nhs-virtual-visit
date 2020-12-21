import { setupTrust } from "../../test/testUtils/factories";
import AppContainer from "../../src/containers/AppContainer";

describe("updateTrust contract test", () => {
  it("updates the video provider", async () => {
    const container = AppContainer.getInstance();
    const { trustId } = await setupTrust({ videoProvider: "whereby" });
    const updateTrust = container.getUpdateTrust();

    const { id: updatedTrustId } = await updateTrust({
      id: trustId,
      videoProvider: "whereby",
    });

    const { trust } = await container.getRetrieveTrustById()(updatedTrustId);

    expect(trust.videoProvider).toEqual("whereby");
  });

  it("returns a null id and error if the Trust does not exist", async () => {
    const container = AppContainer.getInstance();
    const updateTrust = container.getUpdateTrust();

    const result = await updateTrust({
      id: 12345,
      videoProvider: "whereby",
    });

    expect(result.id).toBeNull();
    expect(result.error).toBeNull();
  });
});
