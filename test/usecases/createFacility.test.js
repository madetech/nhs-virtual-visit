import createFacility from "../../src/usecases/createFacility";

describe("createFacility", () => {
  let container;
  const expectedFacilityId = 1;
  const createFacilitySpy = jest.fn(async () => expectedFacilityId);
  const requestObj = {
    name: "Defoe Hospital",
    orgId: 2,
    code: "DFH",
    userId: 10,
  };
  beforeEach(() => {
    container = {
      getCreateFacilityGateway: () => createFacilitySpy,
    };
  });

  it("returns no error when facility can be created", async () => {
    // Act
    const { facilityId, error } = await createFacility(container)(requestObj);
    // Assert
    expect(facilityId).toEqual(expectedFacilityId);
    expect(error).toBeNull();
    expect(createFacilitySpy).toHaveBeenCalledWith(requestObj);
  });

  it("returns error response when createFacilityGateway throws an error.", async () => {
    container.getCreateFacilityGateway = () =>
      jest.fn(async () => {
        throw new Error("error");
      });

    const { facilityId, error } = await createFacility(container)(requestObj);

    expect(error).toEqual("There was an error creating a facility.");
    expect(facilityId).toBeNull();
  });
  it("returns error when name is undefined", async () => {
    // Act
    const { facilityId, error } = await createFacility(container)({
      ...requestObj,
      name: undefined,
    });

    expect(error).toEqual("name must be provided.");
    expect(facilityId).toBeUndefined();
  });

  it("returns error when code is undefined", async () => {
    // Act
    const { facilityId, error } = await createFacility(container)({
      ...requestObj,
      code: undefined,
    });

    expect(error).toEqual("facility code must be provided.");
    expect(facilityId).toBeUndefined();
  });

  it("returns error when orgId is undefined", async () => {
    // Act
    const { facilityId, error } = await createFacility(container)({
      ...requestObj,
      orgId: undefined,
    });

    expect(error).toEqual("organisation id must be provided.");
    expect(facilityId).toBeUndefined();
  });
});
