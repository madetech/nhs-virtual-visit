import retrieveWardById from "./retrieveWardById";
import { setupWardWithinHospitalAndTrust } from "../testUtils/factories";

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
      hospitalName: "Test Hospital",
      hospitalId: hospitalId,
    });
  });
});
