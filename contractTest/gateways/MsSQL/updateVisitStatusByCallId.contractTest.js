import updateVisitStatusByCallIdGateway from "../../../src/gateways/MsSQL/updateVisitStatusByCallId";
import {
  setupOrganisationFacilityDepartmentAndManager,
  setUpScheduledCall,
} from "../../../test/testUtils/factories";
import {
  statusToId,
  COMPLETE,
  SCHEDULED,
  CANCELLED,
  ARCHIVED,
} from "../../../src/helpers/visitStatus";
import AppContainer from "../../../src/containers/AppContainer";

describe("updateVisitStatusByCallIdGateway", () => {
  const container = AppContainer.getInstance();
  it("updates a visit status to COMPLETE", async () => {
    // Arrange
    const {
      departmentId,
    } = await setupOrganisationFacilityDepartmentAndManager();
    const { uuid: id } = await setUpScheduledCall({ departmentId });
    // Act
    const { error, visit } = await updateVisitStatusByCallIdGateway(container)({
      id,
      departmentId,
      status: statusToId(COMPLETE),
    });
    console.log(visit);
    // Assert
    expect(visit.status).toEqual(statusToId(COMPLETE));
    expect(error).toBeNull();
  });
  it("updates a visit status to SCHEDULED", async () => {
    // Arrange
    const {
      departmentId,
    } = await setupOrganisationFacilityDepartmentAndManager();
    const { uuid: id } = await setUpScheduledCall({ departmentId });
    // Act
    const { error, visit } = await updateVisitStatusByCallIdGateway(container)({
      id,
      departmentId,
      status: statusToId(SCHEDULED),
    });
    // Assert
    expect(visit.status).toEqual(statusToId(SCHEDULED));
    expect(error).toBeNull();
  });
  it("updates a visit status to CANCELLED", async () => {
    // Arrange
    const {
      departmentId,
    } = await setupOrganisationFacilityDepartmentAndManager();
    const { uuid: id } = await setUpScheduledCall({ departmentId });
    // Act
    const { error, visit } = await updateVisitStatusByCallIdGateway(container)({
      id,
      departmentId,
      status: statusToId(CANCELLED),
    });
    // Assert
    expect(visit.status).toEqual(statusToId(CANCELLED));
    expect(error).toBeNull();
  });
  it("updates a visit status to ARCHIVED", async () => {
    // Arrange
    const {
      departmentId,
    } = await setupOrganisationFacilityDepartmentAndManager();
    const { uuid: id } = await setUpScheduledCall({ departmentId });
    // Act
    const { error, visit } = await updateVisitStatusByCallIdGateway(container)({
      id,
      departmentId,
      status: statusToId(ARCHIVED),
    });
    // Assert
    expect(visit.status).toEqual(statusToId(ARCHIVED));
    expect(error).toBeNull();
  });
  it("returns an error if id is not defined", async () => {
    // Arrange
    const {
      departmentId,
    } = await setupOrganisationFacilityDepartmentAndManager();
    await setUpScheduledCall({ departmentId });
    // Act
    const { error, visit } = await updateVisitStatusByCallIdGateway(container)({
      departmentId,
      status: statusToId(COMPLETE),
    });
    // Assert
    expect(error).toEqual("Error retrieving recordset");
    expect(visit).toBeNull();
  });
});
