import AppContainer from "../containers/AppContainer";

describe("retrieveHospitalsByTrustId contract tests", () => {
  const container = AppContainer.getInstance();

  it("returns all the hospitals for a trust", async () => {
    const { trustId } = await container.getCreateTrust()({
      name: "Test Trust",
      adminCode: "TEST",
    });

    const { hospitalId } = await container.getCreateHospital()({
      name: "Test Hospital",
      trustId: trustId,
    });

    const { hospitalId: hospital2Id } = await container.getCreateHospital()({
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

  it("returns an error if no trustId is provided", async () => {
    const { error } = await container.getRetrieveHospitalsByTrustId()();

    expect(error).not.toBeNull();
  });

  it("returns an empty object if the trustId does not exist", async () => {
    const { hospitals } = await container.getRetrieveHospitalsByTrustId()(12);

    expect(hospitals).toEqual([]);
  });
});
