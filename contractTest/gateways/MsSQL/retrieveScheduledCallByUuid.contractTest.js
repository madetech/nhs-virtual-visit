import retrieveScheduledCallByUuidGateway from "../../../src/gateways/MsSQL/retrieveScheduledCallByUuid";
import {
  setupOrganisationFacilityDepartmentAndManager,
  setUpScheduledCall,
} from "../../../test/testUtils/factories";
import { statusToId, SCHEDULED } from "../../../src/helpers/visitStatus";
import AppContainer from "../../../src/containers/AppContainer";

describe("retrieveScheduledCallByUuidGateway", () => {
  const container = AppContainer.getInstance();
  it("retrieves scheduled call when given a valid uuid", async () => {
    // Arrange
    const callTime = new Date(2021, 0, 27, 13, 37, 0, 0);
    const newVisit = {
      patientName: "New Patient",
      recipientEmail: "newtest@testemail.com",
      recipientName: "New Recipient Name",
      recipientNumber: "07123456567",
      callPassword: "foo",
      callTime,
    };
    const {
      departmentId,
    } = await setupOrganisationFacilityDepartmentAndManager();
    await setUpScheduledCall({ departmentId });
    const { id, uuid } = await setUpScheduledCall({
      ...newVisit,
      departmentId,
    });
    // Act
    const { error, visit } = await retrieveScheduledCallByUuidGateway(
      container
    )(uuid);
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
  it("returns an error when given invalid uuid", async () => {
    // Arrange
    const invalidUuid = "invalid";
    // // Act
    const { error, visit } = await retrieveScheduledCallByUuidGateway(
      container
    )(invalidUuid);
    // Assert
    expect(visit).toBeNull();
    expect(error).toBeDefined();
  });
  it("returns an error when given uuid is not defined", async () => {
    // Arrange
    // // Act
    const { error, visit } = await retrieveScheduledCallByUuidGateway(
      container
    )();
    // Assert
    expect(visit).toBeNull();
    expect(error).toBeDefined();
  });
});
