import retrieveFacilitiesByOrgId from "../../src/usecases/retrieveFacilitiesByOrgId";

describe("retrieveFacilitiesByOrgId", () => {
  // Arrange
  const expectedOrgId = 1;
  const expectedFacilitiesWithWards = [
    {
      id: 1,
      name: "hospitalNameOne",
      code: "HN1",
      status: 0,
      wards: [{ id: 1, name: "Ward 1 for hospitalNameOne" }],
    },
    {
      id: 2,
      name: "hospitalNameTwo",
      code: "HN2",
      status: 1,
      wards: [{ id: 2, name: "Ward 1 for hospitalNameTwo" }],
    },
  ];
  const expectedFacilitiesWithoutWards = expectedFacilitiesWithWards.map(
    (facility) => ({
      id: facility.id,
      name: facility.name,
      code: facility.code,
      status: facility.status,
    })
  );
  let retrieveFacilitiesByOrgIdSpy = jest
    .fn()
    .mockReturnValue(expectedFacilitiesWithoutWards);
  let container;

  beforeEach(() => {
    container = {
      getRetrieveFacilitiesByOrgIdGateway: () => retrieveFacilitiesByOrgIdSpy,
    };
  });
  describe("without withWards option or withWards is false", () => {
    it("returns the correct facilities array if there is no options in the args", async () => {
      const { facilities, error } = await retrieveFacilitiesByOrgId(container)(
        expectedOrgId
      );
      expect(retrieveFacilitiesByOrgIdSpy).toBeCalledWith({
        orgId: expectedOrgId,
        options: { withWards: false },
      });
      expect(facilities).toEqual(expectedFacilitiesWithoutWards);
      expect(error).toBeNull();
    });
    it("returns the correct facilities array if withWards option is false", async () => {
      const { facilities, error } = await retrieveFacilitiesByOrgId(
        container
      )(expectedOrgId, { withWards: false });
      expect(retrieveFacilitiesByOrgIdSpy).toBeCalledWith({
        orgId: expectedOrgId,
        options: { withWards: false },
      });
      expect(facilities).toEqual(expectedFacilitiesWithoutWards);
      expect(error).toBeNull();
    });
  });
  describe("withWards option is true", () => {
    it("returns a facilities array containing an array of wards", async () => {
      // Arrange
      const retrieveFacilitiesByOrgIdWithWardsSpy = jest
        .fn()
        .mockReturnValue(expectedFacilitiesWithWards);
      container = {
        ...container,
        getRetrieveFacilitiesByOrgIdGateway: () =>
          retrieveFacilitiesByOrgIdWithWardsSpy,
      };
      const { error, facilities } = await retrieveFacilitiesByOrgId(
        container
      )(expectedOrgId, { withWards: true });
      expect(retrieveFacilitiesByOrgIdWithWardsSpy).toBeCalledWith({
        orgId: expectedOrgId,
        options: { withWards: true },
      });
      expect(facilities).toEqual(expectedFacilitiesWithWards);
      expect(error).toBeNull();
    });
  });
  it("returns an error object if orgId is undefined", async () => {
    // Act
    const { facilities, error } = await retrieveFacilitiesByOrgId(container)();
    // Assert
    expect(error).toEqual("organisation id must be provided");
    expect(facilities).toBeUndefined();
  });
  it("returns error if gateway db throws an error", async () => {
    // Act
    const retrieveFacilitiesByOrgIdErrorStub = jest.fn(async () => {
      throw new Error("error");
    });
    container = {
      ...container,
      getRetrieveFacilitiesByOrgIdGateway: () =>
        retrieveFacilitiesByOrgIdErrorStub,
    };
    // Act
    const { facilities, error } = await retrieveFacilitiesByOrgId(container)(
      expectedOrgId
    );
    // Assert
    expect(error).toEqual("There was an error retrieving facilities.");
    expect(facilities).toBeNull();
  });
});
