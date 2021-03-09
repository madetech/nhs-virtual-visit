import retrieveFacilitiesByOrgId from "../../src/usecases/retrieveFacilitiesByOrgId";
import logger from "../../logger";

describe("retrieveFacilitiesByOrgId", () => {
  // Arrange
  const expectedOrgId = 1;
  const expectedFacilitiesWithWards = [
    {
      id: 1,
      name: "hospitalNameOne",
      code: "HN1",
      status: "disabled",
      uuid: "421bc539-f800-4677-8e5f-be0998d214e8",
      wards: [{ id: 1, name: "Ward 1 for hospitalNameOne" }],
    },
    {
      id: 2,
      name: "hospitalNameTwo",
      code: "HN2",
      status: "active",
      uuid: "bf800c31-bcfa-4cd7-a34c-3a332db3430c",
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

  const dbMockFacilitiesWithoutWards = expectedFacilitiesWithoutWards.map(
    (facility) => ({ ...facility, status: facility.status == "active" ? 1 : 0 })
  );
  let retrieveFacilitiesByOrgIdSpy = jest
    .fn()
    .mockReturnValue(dbMockFacilitiesWithoutWards);
  let container;

  beforeEach(() => {
    container = {
      getRetrieveFacilitiesByOrgIdGateway: () => retrieveFacilitiesByOrgIdSpy,
      logger
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
      const dbMockFacilitiesWithWards = expectedFacilitiesWithWards.map(
        (facility) => ({
          ...facility,
          status: facility.status == "active" ? 1 : 0,
        })
      );
      const retrieveFacilitiesByOrgIdWithWardsSpy = jest
        .fn()
        .mockReturnValue(dbMockFacilitiesWithWards);
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
