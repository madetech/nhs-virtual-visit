import updateScheduledCallStartTimeByCallUuidGateway from "../../../src/gateways/MsSQL/updateScheduledCallStartTimeByCallUuid";
import AppContainer from "../../../src/containers/AppContainer";
import moment from "moment";
import { 
    setupAdminAndOrganisation,
    setUpFacility,
    setUpDepartment,
    setUpScheduledCall
} from "../../../test/testUtils/factories";

describe("updateScheduledCallStartTimeByCallUuidGateway", () => {
    const container = AppContainer.getInstance();
    
    it("updates the start_time in db when given a valid call uuid", async() => {
        // Arrange
        const { adminId, orgId: orgOneId } = await setupAdminAndOrganisation();
        const { facilityId: facilityOneId } = await setUpFacility({ createdBy: adminId, orgId: orgOneId });
        const { departmentId: departmentOneId } = await setUpDepartment({ createdBy: adminId, facilityId: facilityOneId });
        const { uuid } = await setUpScheduledCall({ departmentId: departmentOneId });
        const startTime = Date.now();
        // Act
        const visit = await updateScheduledCallStartTimeByCallUuidGateway(container)(uuid);
        // Assert
        expect(moment(visit.start_time).isSameOrAfter(moment(startTime), "s")).toBeTruthy();
        expect(visit.uuid).toEqual(uuid);
    });
    it("returns undefined if scheduled_call table is empty", async() => {
        // Arrange
        const { adminId, orgId: orgOneId } = await setupAdminAndOrganisation();
        const { facilityId: facilityOneId } = await setUpFacility({ createdBy: adminId, orgId: orgOneId });
        await setUpDepartment({ createdBy: adminId, facilityId: facilityOneId });

        // Act
        const visit = await updateScheduledCallStartTimeByCallUuidGateway(container)("123e4567-e89b-12d3-a456-426614174000");
        // Assert
        expect(visit).toBeUndefined();
    })
    it("returns undefined if call uuid does not exist", async() => {
        // Arrange
        const { adminId, orgId: orgOneId } = await setupAdminAndOrganisation();
        const { facilityId: facilityOneId } = await setUpFacility({ createdBy: adminId, orgId: orgOneId });
        const { departmentId: departmentOneId } = await setUpDepartment({ createdBy: adminId, facilityId: facilityOneId });
        await setUpScheduledCall({ departmentId: departmentOneId });

        // Act
        const visit = await updateScheduledCallStartTimeByCallUuidGateway(container)("123e4567-e89b-12d3-a456-426614174000");
        // Assert
        expect(visit).toBeUndefined();
    });
    it("throws an error if uuid is invalid", async() => {
        // Arrange
        const { adminId, orgId: orgOneId } = await setupAdminAndOrganisation();
        const { facilityId: facilityOneId } = await setUpFacility({ createdBy: adminId, orgId: orgOneId });
        const { departmentId: departmentOneId } = await setUpDepartment({ createdBy: adminId, facilityId: facilityOneId });
        await setUpScheduledCall({ departmentId: departmentOneId });

        // Act
        expect(async() => await updateScheduledCallStartTimeByCallUuidGateway(container)("abc")).rejects.toThrowError();
        // Assert
    });
    it("returns undefined if call uuid is undefined", async() => {
        // Arrange
        const { adminId, orgId: orgOneId } = await setupAdminAndOrganisation();
        const { facilityId: facilityOneId } = await setUpFacility({ createdBy: adminId, orgId: orgOneId });
        const { departmentId: departmentOneId } = await setUpDepartment({ createdBy: adminId, facilityId: facilityOneId });
        await setUpScheduledCall({ departmentId: departmentOneId });

        // Act
        const visit = await updateScheduledCallStartTimeByCallUuidGateway(container)();
        // Assert
        expect(visit).toBeUndefined();
    });

})