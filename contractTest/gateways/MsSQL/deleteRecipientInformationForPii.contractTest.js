import deleteRecipientInformationForPiiGateway from "../../../src/gateways/MsSQL/deleteRecipientInformationForPii";
import {
  setUpScheduledCall,
  setupOrganisationFacilityDepartmentAndManager,
} from "../../../test/testUtils/factories";
import AppContainer from "../../../src/containers/AppContainer";

describe("deleteRecipientInformationForPiiGateway", () => {
  const container = AppContainer.getInstance();

  it("deletes the sensitive data from the scheduled_call table", async () => {
    // Arrange
    const { departmentId } = await setupOrganisationFacilityDepartmentAndManager();
    const { id } = await setUpScheduledCall({ departmentId });
    
    // Act
    const deleteRecipientInformationForPii = deleteRecipientInformationForPiiGateway(container);
    const { success, error } = await deleteRecipientInformationForPii({ callId: id });

    // Assert
    expect(success).toBe(true);
    expect(error).toBeNull();
  });

  it("errors if the callId isn't in the database", async () => {
    // Arrange
    const { departmentId } = await setupOrganisationFacilityDepartmentAndManager();
    await setUpScheduledCall({ departmentId });
    const fakeCallId = 1000000;

    // Act
    const deleteRecipientInformationForPii = deleteRecipientInformationForPiiGateway(container);
    const { success, error } = await deleteRecipientInformationForPii({ callId: fakeCallId });
    
    // Assert
    expect(success).toBe(false);
    expect(error).toEqual("Call could not be found in the database");
  });

  it("catches errors",  async () => {
    // Arrange
    const { departmentId } = await setupOrganisationFacilityDepartmentAndManager();
    await setUpScheduledCall({ departmentId });
    const invalidCallId = "Invalid Id";

    // Act
    const deleteRecipientInformationForPii = deleteRecipientInformationForPiiGateway(container);
    const { success, error } = await deleteRecipientInformationForPii({ callId: invalidCallId });

    // Assert
    expect(success).toBe(false);
    expect(error).toEqual(
      "RequestError: Conversion failed when converting the nvarchar value 'Invalid Id' to data type int."
    );
  });
});