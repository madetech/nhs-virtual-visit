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
    console.log(callId);
    const callTime = new Date(2021, 0, 27, 13, 37, 0, 0);
    const updatedVisit = {
      callId,
      patientName: "Patient Updated",
      recipientEmail: "testupdated@testemail.com",
      recipientName: "Recipient Name Updated",
      recipientNumber: "07123456567",
      callTime,
    };
    // Act
    const { error, visit } = await updateVisitByIdGateway(container)(
      updatedVisit
    );
    console.log(visit);
    // Assert
    expect(visit.patientName).toEqual(updatedVisit.patientName);
    expect(visit.recipientEmail).toEqual(updatedVisit.recipientEmail);
    expect(visit.recipientName).toEqual(updatedVisit.recipientName);
    expect(visit.recipientNumber).toEqual(updatedVisit.recipientNumber);
    expect(visit.callTime).toEqual(updatedVisit.callTime);
    expect(error).toBeNull();
  });
  it("returns an error if callId is undefined", async () => {
    // Arrange
    const {
      departmentId,
    } = await setupOrganisationFacilityDepartmentAndManager();
    const { id: callId } = await setUpScheduledCall({ departmentId });
    console.log(callId);
    const callTime = new Date(2021, 0, 27, 13, 37, 0, 0);
    const updatedVisit = {
      patientName: "Patient Updated",
      recipientEmail: "testupdated@testemail.com",
      recipientName: "Recipient Name Updated",
      recipientNumber: "07123456567",
      callTime,
    };
    // Act
    const { error, visit } = await updateVisitByIdGateway(container)(
      updatedVisit
    );

    // Assert
    expect(error).toBeDefined();
    expect(visit).toBeNull();
  });
});
