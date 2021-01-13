import retrieveWardById from "../../../src/gateways/PostgreSQL/retrieveWardById";
import { setupWardWithinHospitalAndTrust } from "../../../test/testUtils/factories";

describe("retrieveWardById", () => {
  it("returns the ward", async () => {
    const {
      wardId,
      hospitalId,
      trustId,
    } = await setupWardWithinHospitalAndTrust();

    const { ward, error } = await retrieveWardById(wardId, trustId);

    expect(error).toBeNull();
    expect(ward).toEqual({
      id: wardId,
      name: "Test Ward",
      status: "active",
      hospitalName: "Test Hospital",
      hospitalId: hospitalId,
    });
  });
});
