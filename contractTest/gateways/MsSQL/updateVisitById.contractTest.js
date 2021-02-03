import updateVisitByIdGateway from "../../../src/gateways/MsSQL/updateVisitById";
import {
  setupOrganisationFacilityDepartmentAndManager,
  setUpScheduledCall,
} from "../../../test/testUtils/factories";
import AppContainer from "../../../src/containers/AppContainer";

describe("updateVisitByIdGateway", () => {
  const container = AppContainer.getInstance();
  it("updates a visit status to COMPLETE", async () => {
    // Arrange
    const {
      departmentId,
    } = await setupOrganisationFacilityDepartmentAndManager();
    const { id: callId } = await setUpScheduledCall({ departmentId });
    const callTime = new Date(2021, 0, 27, 13, 37, 0, 0);
    const updatedVisit = {
      id: callId,
      patientName: "Patient Updated",
      recipientEmail: "testupdated@testemail.com",
      recipientName: "Recipient Name Updated",
      recipientNumber: "07123456567",
      callTime,
    };
    // Act
    const { error, visit } = await updateVisitByIdGateway(container)({
      visit: updatedVisit,
    });
    // Assert
    expect(visit.patientName).toEqual(updatedVisit.patientName);
    expect(visit.recipientEmail).toEqual(updatedVisit.recipientEmail);
    expect(visit.recipientName).toEqual(updatedVisit.recipientName);
    expect(visit.recipientNumber).toEqual(updatedVisit.recipientNumber);
    expect(visit.callTime).toEqual(updatedVisit.callTime);
    expect(error).toBeNull();
  });
});
