import createDepartmentGateway from "../../../src/gateways/MsSQL/createDepartment";
import {
  setupOrganization,
  setUpManager,
  setUpFacility,
} from "../../../test/testUtils/factories";
import AppContainer from "../../../src/containers/AppContainer";

describe("createDepartment", () => {
  const container = AppContainer.getInstance();
  const departmentToCreate = {
    name: "Test Department",
    code: "departmentCode",
  };
  it("returns an object containing the department", async () => {
    // Arrange
    const {
      organisation: { id: orgId },
    } = await setupOrganization();

    const email = `${Math.random()}@nhs.co.uk`;
    const {
      user: { id: userId },
    } = await setUpManager({ organisationId: orgId, email });

    const facilityUuid = await setUpFacility({ orgId, createdBy: userId });
    const facility = await container.getRetrieveFacilityByUuidGateway()(
      facilityUuid
    );
    // Act
    const departmentUuid = await createDepartmentGateway(container)({
      ...departmentToCreate,
      pin: "1234",
      facilityId: facility.id,
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
      facilityId: facility.id,
    });
  });
  describe("throws an error", () => {
    it("name is undefined", async () => {
      const {
        organisation: { id: orgId },
      } = await setupOrganization();

      const email = `${Math.random()}@nhs.co.uk`;
      const {
        user: { id: userId },
      } = await setUpManager({ organisationId: orgId, email });

      const facilityUuid = await setUpFacility({ orgId, createdBy: userId });
      const facility = await container.getRetrieveFacilityByUuidGateway()(
        facilityUuid
      );
      // Act && Assert
      expect(
        async () =>
          await createDepartmentGateway(container)({
            ...departmentToCreate,
            name: undefined,
            pin: "1234",
            facilityId: facility.id,
            createdBy: userId,
          })
      ).rejects.toThrow();
    });
    it("code is undefined", async () => {
      const {
        organisation: { id: orgId },
      } = await setupOrganization();

      const email = `${Math.random()}@nhs.co.uk`;
      const {
        user: { id: userId },
      } = await setUpManager({ organisationId: orgId, email });

      const facilityUuid = await setUpFacility({ orgId, createdBy: userId });
      const facility = await container.getRetrieveFacilityByUuidGateway()(
        facilityUuid
      );
      // Act && Assert
      expect(
        async () =>
          await createDepartmentGateway(container)({
            ...departmentToCreate,
            code: undefined,
            pin: "1234",
            facilityId: facility.id,
            createdBy: userId,
          })
      ).rejects.toThrow();
    });

    it("pin is undefined", async () => {
      const {
        organisation: { id: orgId },
      } = await setupOrganization();

      const email = `${Math.random()}@nhs.co.uk`;
      const {
        user: { id: userId },
      } = await setUpManager({ organisationId: orgId, email });

      const facilityUuid = await setUpFacility({ orgId, createdBy: userId });
      const facility = await container.getRetrieveFacilityByUuidGateway()(
        facilityUuid
      );
      // Act && Assert
      expect(
        async () =>
          await createDepartmentGateway(container)({
            ...departmentToCreate,
            code: undefined,
            facilityId: facility.id,
            createdBy: userId,
          })
      ).rejects.toThrow();
    });
    it("facilityId is undefined", async () => {
      const {
        organisation: { id: orgId },
      } = await setupOrganization();

      const email = `${Math.random()}@nhs.co.uk`;
      const {
        user: { id: userId },
      } = await setUpManager({ organisationId: orgId, email });

      const facilityUuid = await setUpFacility({ orgId, createdBy: userId });
      await container.getRetrieveFacilityByUuidGateway()(facilityUuid);
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
