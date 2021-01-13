import retrieveTrustById from "../../../src/gateways/PostgreSQL/retrieveTrustById";
import { setupTrust } from "../../../test/testUtils/factories";

describe("retrieveTrustById", () => {
  it("returns an object containing the trust", async () => {
    const { trustId } = await setupTrust();

    const { trust, error } = await retrieveTrustById(trustId);

    expect(error).toBeNull();
    expect(trust).toEqual({
      id: trustId,
      name: "Test Trust",
      videoProvider: "whereby",
    });
  });

  it("returns an error when trust not found for id", async () => {
    const { error } = await retrieveTrustById(12);
    expect(error).toBeDefined();
    expect(error).toEqual("Trust not found for id");
  });

  it("returns an error when trust id not set", async () => {
    const { error } = await retrieveTrustById();
    expect(error).toBeDefined();
    expect(error).toEqual("Attempting to retrieve trust with no trust Id set");
  });
});
