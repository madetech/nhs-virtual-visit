import { setupTrust } from "../../test/testUtils/factories";
import AppContainer from "../../src/containers/AppContainer";

describe("updateTrust contract test", () => {
  const container = AppContainer.getInstance();

  it("updates the video provider", async () => {
    const { trustId } = await setupTrust({ videoProvider: "whereby" });
    const { id: updatedTrustId } = await container.getUpdateTrust()({
      trustId: trustId,
      videoProvider: "whereby",
    });

    expect(updatedTrustId).toEqual(trustId);

    const { trust } = await container.getRetrieveTrustById()(updatedTrustId);

    expect(trust.videoProvider).toEqual("whereby");
  });

  // it("returns a null id and error if the Trust does not exist", async () => {
  //   const container = AppContainer.getInstance();
  //   const updateTrust = container.getUpdateTrust();

  //   const result = await updateTrust({
  //     trustId: 12345,
  //     videoProvider: "whereby",
  //   });

  //   expect(result.id).toBeNull();
  //   expect(result.error).toBeNull();
  // });
});
