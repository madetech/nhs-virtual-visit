import AppContainer from "../containers/AppContainer";

describe("retrieveWardsByHospitalId contract tests", () => {
  const container = AppContainer.getInstance();

  it("returns wards for a given hospital ID", async () => {
    const { trustId } = await container.getCreateTrust(container)({
      name: "Test Trust",
      adminCode: "TEST",
      password: "password",
    });

    const { hospitalId } = await container.getCreateHospital()({
      name: "Test Hospital 1",
      trustId: trustId,
    });

    const { hospital2Id } = await container.getCreateHospital()({
      name: "Test Hospital 2",
      trustId: trustId,
    });

    const { wardId: ward1Id } = await container.getCreateWard()({
      name: "Test Ward 1",
      code: "wardCode1",
      hospitalId: hospitalId,
      trustId: trustId,
    });

    const { wardId: ward2Id } = await container.getCreateWard()({
      name: "Test Ward 2",
      code: "wardCode2",
      hospitalId: hospitalId,
      trustId: trustId,
    });

    await container.getCreateWard()({
      name: "Test Ward 3",
      code: "wardCode3",
      hospitalId: hospital2Id,
      trustId: trustId,
    });

    const { wards, error } = await container.getRetrieveWardsByHospitalId()(
      hospitalId
    );

    expect(wards.map((w) => w.id)).toEqual([ward1Id, ward2Id]);

    expect(wards).toEqual([
      {
        id: ward1Id,
        name: "Test Ward 1",
        code: "wardCode1",
        hospitalName: "Test Hospital 1",
      },
      {
        id: ward2Id,
        name: "Test Ward 2",
        code: "wardCode2",
        hospitalName: "Test Hospital 1",
      },
    ]);

    expect(error).toBeNull();
  });
});
