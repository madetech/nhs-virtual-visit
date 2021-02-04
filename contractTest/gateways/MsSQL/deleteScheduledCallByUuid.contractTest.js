import deleteScheduledCallByUuidGateway from "../../../src/gateways/MsSQL/deleteScheduledCallByUuid";
import {
  setUpScheduledCall,
  setupOrganisationFacilityDepartmentAndManager,
} from "../../../test/testUtils/factories";
import AppContainer from "../../../src/containers/AppContainer";

describe("deleteScheduledCallByUuidGateway", () => {
  const container = AppContainer.getInstance();

  it("cancels a visit", async () => {
    // Arranges
    const {
      departmentId,
    } = await setupOrganisationFacilityDepartmentAndManager();
    const { uuid } = await setUpScheduledCall({ departmentId });

    // Act
    const { success, error } = await deleteScheduledCallByUuidGateway(
      container
    )(uuid);

    // Assert
    expect(success).toBe(true);
    expect(error).toBeNull();
  });

  it("errors if the callId isn't in the database", async () => {
    // Arrange
    const {
      departmentId,
    } = await setupOrganisationFacilityDepartmentAndManager();
    await setUpScheduledCall({ departmentId });
    const invalidCallId = undefined;

    // Act
    const { success, error } = await deleteScheduledCallByUuidGateway(
      container
    )(invalidCallId);

    // Assert
    expect(success).toBe(false);
    expect(error).toEqual("Call could not be found in the database");
  });

  it("catches errors", async () => {
    // Arrange
    const {
      departmentId,
    } = await setupOrganisationFacilityDepartmentAndManager();
    await setUpScheduledCall({ departmentId });
    const invalidCallId = "invalidUuid";

    // Act
    const { success, error } = await deleteScheduledCallByUuidGateway(
      container
    )(invalidCallId);

    // Assert
    expect(success).toBe(false);
    expect(error).toEqual(
      "RequestError: Conversion failed when converting from a character string to uniqueidentifier."
    );
  });
});
