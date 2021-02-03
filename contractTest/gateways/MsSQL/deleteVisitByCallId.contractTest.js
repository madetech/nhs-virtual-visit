import deleteVisitByCallIdGateway from "../../../src/gateways/MsSQL/deleteVisitByCallId";
import {
  setupVisit,
  setupOrganisationFacilityDepartmentAndManager,
} from "../../../test/testUtils/factories";
import AppContainer from "../../../src/containers/AppContainer";

describe("deleteVisitByCallIdGateway", () => {
  const container = AppContainer.getInstance();

  it("cancels a visit", async () => {
    // Arranges
    const {
      departmentId,
    } = await setupOrganisationFacilityDepartmentAndManager();
    const { id: callId } = await setupVisit({ wardId: departmentId });

    // Act
    const { success, error } = await deleteVisitByCallIdGateway(container)(
      callId
    );

    // Assert
    expect(success).toBe(true);
    expect(error).toBeNull();
  });

  it("errors if the callId isn't in the database", async () => {
    // Arrange
    const {
      departmentId,
    } = await setupOrganisationFacilityDepartmentAndManager();
    await setupVisit({ wardId: departmentId });
    const invalidCallId = 10000000;

    // Act
    const { success, error } = await deleteVisitByCallIdGateway(container)(
      invalidCallId
    );

    // Assert
    expect(success).toBe(false);
    expect(error).toEqual("Call could not be found in the database");
  });
});
