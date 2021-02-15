import retrieveVisitsGateway from "../../../src/gateways/MsSQL/retrieveVisits";
import {
  setupOrganisationFacilityDepartmentAndManager,
  setUpScheduledCall,
} from "../../../test/testUtils/factories";
import {
  CANCELLED,
  SCHEDULED,
  COMPLETE,
  statusToId,
} from "../../../src/helpers/visitStatus";
import AppContainer from "../../../src/containers/AppContainer";

describe("retrieveOrderedActiveCallsByDepartmentIdGateway", () => {
  const container = AppContainer.getInstance();
  it("returns an object containing the active calls ordered in order of call time", async () => {
    // Arrange
    const {
      departmentId,
    } = await setupOrganisationFacilityDepartmentAndManager();
    const callTimeOne = new Date(2021, 11, 27, 13, 37, 0, 0);
    const callOne = {
      patientName: "Patient One",
      recipientEmail: "patientOne@testemail.com",
      recipientName: "Recipient One Name",
      recipientNumber: "07123456567",
      callTime: callTimeOne.toISOString(),
    };
    const callTimeTwo = new Date(2021, 11, 18, 13, 37, 0, 0);
    const callTwo = {
      patientName: "Patient Two",
      recipientEmail: "patientTwo@testemail.com",
      recipientName: "Recipient One Name",
      recipientNumber: "07123456567",
      callTime: callTimeTwo.toISOString(),
    };
    const callTimeThree = new Date(2021, 11, 18, 13, 37, 0, 0);
    const callThree = {
      patientName: "Patient Three",
      recipientEmail: "patientThree@testemail.com",
      recipientName: "Recipient One Name",
      recipientNumber: "07123456567",
      callTime: callTimeThree.toISOString(),
    };
    const { uuid: callOneCallId, id: callOneId } = await setUpScheduledCall({
      ...callOne,
      departmentId,
    });
    const { uuid: callTwoCallId, id: callTwoId } = await setUpScheduledCall({
      ...callTwo,
      departmentId,
    });
    const { uuid: callThreeCallId } = await setUpScheduledCall({
      ...callThree,
      departmentId,
    });
    await container.getUpdateVisitStatusByCallIdGateway()({
      id: callThreeCallId,
      departmentId,
      status: statusToId(CANCELLED),
    });
    await container.getUpdateVisitStatusByCallIdGateway()({
      id: callTwoCallId,
      departmentId,
      status: statusToId(COMPLETE),
    });
    // Act
    const { scheduledCalls, error } = await retrieveVisitsGateway(container)(
      departmentId
    );
    // Assert
    expect(scheduledCalls).toEqual([
      {
        id: callTwoId,
        callId: callTwoCallId,
        status: statusToId(COMPLETE),
        ...callTwo,
      },
      {
        id: callOneId,
        callId: callOneCallId,
        status: statusToId(SCHEDULED),
        ...callOne,
      },
    ]);
    expect(error).toBeNull();
  });
  it("returns an empty array if departmentId is undefined", async () => {
    // Act
    const { scheduledCalls, error } = await retrieveVisitsGateway(container)(
      undefined
    );
    // Assert
    expect(scheduledCalls).toEqual([]);
    expect(error).toBeNull();
  });
});
