import AppContainer from "../containers/AppContainer";
import { setupTrust, setupHospital, setupWard } from "../testUtils/factories";

describe("retrieveHospitalsByTrustId contract tests", () => {
  const container = AppContainer.getInstance();

  it("returns all the hospitals for a trust", async () => {
    const { trustId } = await setupTrust();

    const { hospitalId } = await setupHospital({
      name: "Test Hospital",
      trustId: trustId,
    });

    const { hospitalId: hospital2Id } = await setupHospital({
      name: "Test Hospital 2",
      trustId: trustId,
    });

    const {
      hospitals,
      error,
    } = await container.getRetrieveHospitalsByTrustId()(trustId);

    expect(hospitals).toEqual([
      { id: hospitalId, name: "Test Hospital" },
      { id: hospital2Id, name: "Test Hospital 2" },
    ]);
    expect(error).toBeNull();
  });

  it("returns all the hospitals with their wards for a trust ", async () => {
    const { trustId } = await setupTrust();

    const { hospitalId } = await setupHospital({
      name: "Test Hospital",
      trustId: trustId,
    });

    const { hospitalId: hospital2Id } = await setupHospital({
      name: "Test Hospital 2",
      trustId: trustId,
    });

    const { wardId: ward1Id } = await setupWard({
      name: "Test Ward 1",
      code: "wardCode1",
      hospitalId: hospitalId,
      trustId: trustId,
    });

    const { wardId: ward2Id } = await setupWard({
      name: "Test Ward 2",
      code: "wardCode2",
      hospitalId: hospitalId,
      trustId: trustId,
    });

    const { wardId: ward3Id } = await setupWard({
      name: "Test Ward 3",
      code: "wardCode3",
      hospitalId: hospital2Id,
      trustId: trustId,
    });

    const { wardId: ward4Id } = await setupWard({
      name: "Archived ward",
      code: "wardCode4",
      hospitalId: hospital2Id,
      trustId: trustId,
    });

    await container.getArchiveWard()(ward4Id, trustId);

    const {
      hospitals,
      error,
    } = await container.getRetrieveHospitalsByTrustId()(trustId, {
      withWards: true,
    });

    expect(hospitals).toEqual([
      {
        id: hospitalId,
        name: "Test Hospital",
        wards: [
          { id: ward1Id, name: "Test Ward 1" },
          { id: ward2Id, name: "Test Ward 2" },
        ],
      },
      {
        id: hospital2Id,
        name: "Test Hospital 2",
        wards: [{ id: ward3Id, name: "Test Ward 3" }],
      },
    ]);
    expect(error).toBeNull();
  });

  it("returns an error if no trustId is provided", async () => {
    const { error } = await container.getRetrieveHospitalsByTrustId()();

    expect(error).not.toBeNull();
  });

  it("returns an empty object if the trustId does not exist", async () => {
    const { hospitals } = await container.getRetrieveHospitalsByTrustId()(12);

    expect(hospitals).toEqual([]);
  });
});
