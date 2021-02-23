import createDepartmentGateway from "../../../src/gateways/MsSQL/createDepartment";
import { setupOrganisationFacilityAndManager } from "../../../test/testUtils/factories";
import AppContainer from "../../../src/containers/AppContainer";

describe("createDepartment", () => {
  const container = AppContainer.getInstance();
  const departmentToCreate = {
    name: "Test Department",
    code: "departmentCode",
  };
  let ids;
  beforeEach(async () => {
    ids = await setupOrganisationFacilityAndManager();
  });

  it("creates a department", async () => {
    // Arrange
    const { userId, facilityId } = ids;
    // Act
    const departmentUuid = await createDepartmentGateway(container)({
      ...departmentToCreate,
      pin: "1234",
      facilityId,
      createdBy: userId,
    });
    const department = await container.getRetrieveDepartmentByUuidGateway()(
      departmentUuid
    );
    // Assert
    expect(department).toEqual({
      ...departmentToCreate,
      id: department.id,
      uuid: departmentUuid,
      status: 1,
      facilityId,
      pin: expect.anything()
    });
  });
  describe("throws an error", () => {
    it("name is undefined", async () => {
      const { userId, facilityId } = ids;
      // Act && Assert
      expect(
        async () =>
          await createDepartmentGateway(container)({
            ...departmentToCreate,
            name: undefined,
            pin: "1234",
            facilityId: facilityId,
            createdBy: userId,
          })
      ).rejects.toThrow();
    });
    // Arrange
    it("code is undefined", async () => {
      const { userId, facilityId } = ids;
      // Act && Assert
      expect(
        async () =>
          await createDepartmentGateway(container)({
            ...departmentToCreate,
            code: undefined,
            pin: "1234",
            facilityId: facilityId,
            createdBy: userId,
          })
      ).rejects.toThrow();
    });

    it("pin is undefined", async () => {
      // Arrange
      const { userId, facilityId } = ids;
      // Act && Assert
      expect(
        async () =>
          await createDepartmentGateway(container)({
            ...departmentToCreate,
            code: undefined,
            facilityId: facilityId,
            createdBy: userId,
          })
      ).rejects.toThrow();
    });
    it("facilityId is undefined", async () => {
      // // Arrange
      const { userId } = ids;
      // Act && Assert
      expect(
        async () =>
          await createDepartmentGateway(container)({
            ...departmentToCreate,
            pin: "1234",
            createdBy: userId,
          })
      ).rejects.toThrow();
    });
  });
});
