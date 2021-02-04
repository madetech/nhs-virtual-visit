import retrieveScheduledCallByIdGateway from "../../../src/gateways/MsSQL/retrieveScheduledCallById";
import deleteVisitByCallIdGateway from "../../../src/gateways/MsSQL/deleteVisitByCallId";
import {
  setupOrganisationFacilityDepartmentAndManager,
  setUpScheduledCall,
} from "../../../test/testUtils/factories";
import { statusToId, SCHEDULED } from "../../../src/helpers/visitStatus";
import AppContainer from "../../../src/containers/AppContainer";

describe("retrieveScheduledCallByUuidGateway", () => {
  const container = AppContainer.getInstance();
  it("retrieves scheduled call when given a valid id and department id", async () => {
    // Arrange
    const callTime = new Date(2021, 0, 27, 13, 37, 0, 0);
    const newVisit = {
      patientName: "New Patient",
      recipientEmail: "newtest@testemail.com",
      recipientName: "New Recipient Name",
      recipientNumber: "07123456567",
      callTime,
    };
    const {
      departmentId,
    } = await setupOrganisationFacilityDepartmentAndManager();
    const { id, uuid } = await setUpScheduledCall({
      ...newVisit,
      departmentId,
    });
    // Act
    const { visit, error } = await retrieveScheduledCallByIdGateway(container)({
      callId: id,
      departmentId,
    });
    // Assert
    expect(visit).toEqual({
      ...newVisit,
      id,
      uuid,
      status: statusToId(SCHEDULED),
      departmentId,
    });
    expect(error).toBeNull();
  });
  it("returns an error when given invalid id", async () => {
    // Arrange
    const invalidId = "invalid";
    const {
      departmentId,
    } = await setupOrganisationFacilityDepartmentAndManager();
    // Act
    const { error, visit } = await retrieveScheduledCallByIdGateway(container)({
      callId: invalidId,
      departmentId,
    });
    // Assert
    expect(visit).toBeNull();
    expect(error).toBeDefined();
  });
  it("returns an error when given id is not defined", async () => {
    // Arrange
    const {
      departmentId,
    } = await setupOrganisationFacilityDepartmentAndManager();
    // Act
    const { error, visit } = await retrieveScheduledCallByIdGateway(container)({
      callId: undefined,
      departmentId,
    });
    // Assert
    expect(visit).toBeNull();
    expect(error).toBeDefined();
  });

  it("returns an error when given invalid departmentid", async () => {
    // Arrange
    const callTime = new Date(2021, 0, 27, 13, 37, 0, 0);
    const newVisit = {
      patientName: "New Patient",
      recipientEmail: "newtest@testemail.com",
      recipientName: "New Recipient Name",
      recipientNumber: "07123456567",
      callTime,
    };
    const {
      departmentId,
    } = await setupOrganisationFacilityDepartmentAndManager();
    const { id } = await setUpScheduledCall({
      ...newVisit,
      departmentId,
    });
    const invalidDepartmentId = "invalid";
    // Act
    const { error, visit } = await retrieveScheduledCallByIdGateway(container)({
      callId: id,
      departmentId: invalidDepartmentId,
    });
    // Assert
    expect(visit).toBeNull();
    expect(error).toBeDefined();
  });

  it("returns an error when given invalid departmentid", async () => {
    // Arrange
    const {
      departmentId,
    } = await setupOrganisationFacilityDepartmentAndManager();

    // Act
    const { error, visit } = await retrieveScheduledCallByIdGateway(container)({
      callId: undefined,
      departmentId,
    });
    // Assert
    expect(visit).toBeNull();
    expect(error).toBeDefined();
  });

  it("returns an error when the call has been cancelled", async () => {
    // Arrange
    const callTime = new Date(2021, 0, 27, 13, 37, 0, 0);
    const newVisit = {
      patientName: "New Patient",
      recipientEmail: "newtest@testemail.com",
      recipientName: "New Recipient Name",
      recipientNumber: "07123456567",
      callTime,
    };
    const {
      departmentId,
    } = await setupOrganisationFacilityDepartmentAndManager();
    const { id, uuid } = await setUpScheduledCall({
      ...newVisit,
      departmentId,
    });

    await deleteVisitByCallIdGateway(container)(uuid);

    // Act
    const { error, visit } = await retrieveScheduledCallByIdGateway(container)({
      callId: id,
      departmentId,
    });
    // Assert
    expect(visit).toBeNull();
    expect(error).toBeDefined();
  });
});
