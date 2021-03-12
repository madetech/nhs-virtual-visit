import moment from "moment";
import deleteRecipientInformationForPiiGateway from "../../../src/gateways/MsSQL/deleteRecipientInformationForPii";
import {
  setUpScheduledCall,
  setupOrganisationFacilityDepartmentAndManager,
} from "../../../test/testUtils/factories";
import { statusToId, ARCHIVED, SCHEDULED } from "../../../src/helpers/visitStatus"; 
import retrieveScheduledCallsGateway from "../../../test/testUtils/retrieveScheduledCalls";
import AppContainer from "../../../src/containers/AppContainer";

describe("deleteRecipientInformationForPiiGateway", () => {
  const container = AppContainer.getInstance();
  const clearOutTime = new Date(2021, 0, 27);
  let newVisit;

  beforeEach(async () => {
    const visitTime = new Date(moment(clearOutTime).subtract(1, "hour"));
    newVisit = {
      patientName: "New patient 1",
      recipientEmail: "newtest1@testemail.com",
      recipientName: "New recipient name 1",
      recipientNumber: "01234567890",
      callPassword: "foo",
      callTime: visitTime,
    };
  });

  it("deletes the sensitive data for all past calls from the scheduled_call table", async () => {
    // Arrange
    const visit2Time = new Date(moment(clearOutTime).subtract(12, "hours"));
    const newVisit2 = {
      patientName: "New patient 2",
      recipientEmail: "newtest2@testemail.com",
      recipientName: "New recipient name 2",
      recipientNumber: "09876543210",
      callPassword: "bar",
      callTime: visit2Time,
    };

    const { departmentId } = await setupOrganisationFacilityDepartmentAndManager();
    await setUpScheduledCall({ ...newVisit, departmentId });
    await setUpScheduledCall({ ...newVisit2, departmentId });

    // Act
    const deleteRecipientInformationForPii = deleteRecipientInformationForPiiGateway(container);
    const { success, message, error } = await deleteRecipientInformationForPii({ clearOutTime });

    const retrieveScheduledCalls = retrieveScheduledCallsGateway(container);
    const { calls } = await retrieveScheduledCalls();

    // Assert
    expect(success).toBe(true);
    expect(message).toEqual("2 scheduled calls have had recipient data cleared");
    expect(error).toBeNull();

    expect(calls[0].patient_name).toBeNull();
    expect(calls[0].recipient_email).toBeNull();
    expect(calls[0].recipient_name).toBeNull();
    expect(calls[0].recipient_number).toBeNull();
    expect(calls[0].pii_cleared_out).toEqual(clearOutTime);
    expect(calls[0].status).toEqual(statusToId(ARCHIVED));

    expect(calls[1].patient_name).toBeNull();
    expect(calls[1].recipient_email).toBeNull();
    expect(calls[1].recipient_name).toBeNull();
    expect(calls[1].recipient_number).toBeNull();
    expect(calls[1].pii_cleared_out).toEqual(clearOutTime);
    expect(calls[1].status).toEqual(statusToId(ARCHIVED));
  });

  it("deletes the sensitive data for past calls from the scheduled_call table but not future calls", async () => {
    // Arrange
    const visit2Time = new Date(moment(clearOutTime).add(12, "hours"));  
    const newVisit2 = {
      patientName: "New patient 2",
      recipientEmail: "newtest2@testemail.com",
      recipientName: "New recipient name 2",
      recipientNumber: "09876543210",
      callPassword: "bar",
      callTime: visit2Time,
    };

    const { departmentId } = await setupOrganisationFacilityDepartmentAndManager();
    await setUpScheduledCall({ ...newVisit, departmentId });
    await setUpScheduledCall({ ...newVisit2, departmentId });

    // Act
    const deleteRecipientInformationForPii = deleteRecipientInformationForPiiGateway(container);
    const { success, message, error } = await deleteRecipientInformationForPii({ clearOutTime });

    const retrieveScheduledCalls = retrieveScheduledCallsGateway(container);
    const { calls } = await retrieveScheduledCalls();

    // Assert
    expect(success).toBe(true);
    expect(message).toEqual("1 scheduled call has had recipient data cleared");
    expect(error).toBeNull();
    
    expect(calls[0].patient_name).toBeNull();
    expect(calls[0].recipient_email).toBeNull();
    expect(calls[0].recipient_name).toBeNull();
    expect(calls[0].recipient_number).toBeNull();
    expect(calls[0].pii_cleared_out).toEqual(clearOutTime);
    expect(calls[0].status).toEqual(statusToId(ARCHIVED));

    expect(calls[1].patient_name).toEqual("New patient 2");
    expect(calls[1].recipient_email).toEqual("newtest2@testemail.com");
    expect(calls[1].recipient_name).toEqual("New recipient name 2");
    expect(calls[1].recipient_number).toEqual("09876543210")
    expect(calls[1].pii_cleared_out).toBeNull();
    expect(calls[1].status).toEqual(statusToId(SCHEDULED));
  });

  it("deletes the sensitive data for past calls from the scheduled_call table despite patient_name being null", async () => {
    // Arrange 
    newVisit = { ...newVisit, patientName: null };
    const { departmentId } = await setupOrganisationFacilityDepartmentAndManager();
    await setUpScheduledCall({ ...newVisit, departmentId });

    // Act
    const deleteRecipientInformationForPii = deleteRecipientInformationForPiiGateway(container);
    const { success, message, error } = await deleteRecipientInformationForPii({ clearOutTime });
    const retrieveScheduledCalls = retrieveScheduledCallsGateway(container);
    const { calls } = await retrieveScheduledCalls();

    // Assert
    expect(success).toBe(true);
    expect(message).toEqual("1 scheduled call has had recipient data cleared");
    expect(error).toBeNull();

    expect(calls[0].patient_name).toBeNull();
    expect(calls[0].recipient_email).toBeNull();
    expect(calls[0].recipient_name).toBeNull();
    expect(calls[0].recipient_number).toBeNull();
    expect(calls[0].pii_cleared_out).toEqual(clearOutTime);
    expect(calls[0].status).toEqual(statusToId(ARCHIVED));
  });

  it("deletes the sensitive data for past calls from the scheduled_call table despite recipient_name being null", async () => {
    // Arrange 
    newVisit = { ...newVisit, recipientName: null };
    const { departmentId } = await setupOrganisationFacilityDepartmentAndManager();
    await setUpScheduledCall({ ...newVisit, departmentId });
    
    // Act
    const deleteRecipientInformationForPii = deleteRecipientInformationForPiiGateway(container);
    const { success, message, error } = await deleteRecipientInformationForPii({ clearOutTime });
    const retrieveScheduledCalls = retrieveScheduledCallsGateway(container);
    const { calls } = await retrieveScheduledCalls();

    // Assert
    expect(success).toBe(true);
    expect(message).toEqual("1 scheduled call has had recipient data cleared");
    expect(error).toBeNull();

    expect(calls[0].patient_name).toBeNull();
    expect(calls[0].recipient_email).toBeNull();
    expect(calls[0].recipient_name).toBeNull();
    expect(calls[0].recipient_number).toBeNull();
    expect(calls[0].pii_cleared_out).toEqual(clearOutTime);
    expect(calls[0].status).toEqual(statusToId(ARCHIVED));
  });
  
  it("deletes the sensitive data for past calls from the scheduled_call table despite recipient_number being null", async () => {
    // Arrange 
    newVisit = { ...newVisit, recipientNumber: null };
    const { departmentId } = await setupOrganisationFacilityDepartmentAndManager();
    await setUpScheduledCall({ ...newVisit, departmentId });

    // Act
    const deleteRecipientInformationForPii = deleteRecipientInformationForPiiGateway(container);
    const { success, message, error } = await deleteRecipientInformationForPii({ clearOutTime });
    const retrieveScheduledCalls = retrieveScheduledCallsGateway(container);
    const { calls } = await retrieveScheduledCalls();

    // Assert
    expect(success).toBe(true);
    expect(message).toEqual("1 scheduled call has had recipient data cleared");
    expect(error).toBeNull();

    expect(calls[0].patient_name).toBeNull();
    expect(calls[0].recipient_email).toBeNull();
    expect(calls[0].recipient_name).toBeNull();
    expect(calls[0].recipient_number).toBeNull();
    expect(calls[0].pii_cleared_out).toEqual(clearOutTime);
    expect(calls[0].status).toEqual(statusToId(ARCHIVED));
  });

  it("deletes the sensitive data for past calls from the scheduled_call table despite recipient_email being null", async () => {
    // Arrange 
    newVisit = { ...newVisit, recipientEmail: null };
    const { departmentId } = await setupOrganisationFacilityDepartmentAndManager();
    await setUpScheduledCall({ ...newVisit, departmentId });

    // Act
    const deleteRecipientInformationForPii = deleteRecipientInformationForPiiGateway(container);
    const { success, message, error } = await deleteRecipientInformationForPii({ clearOutTime });
    const retrieveScheduledCalls = retrieveScheduledCallsGateway(container);
    const { calls } = await retrieveScheduledCalls();

    // Assert
    expect(success).toBe(true);
    expect(message).toEqual("1 scheduled call has had recipient data cleared");
    expect(error).toBeNull();

    expect(calls[0].patient_name).toBeNull();
    expect(calls[0].recipient_email).toBeNull();
    expect(calls[0].recipient_name).toBeNull();
    expect(calls[0].recipient_number).toBeNull();
    expect(calls[0].pii_cleared_out).toEqual(clearOutTime);
    expect(calls[0].status).toEqual(statusToId(ARCHIVED));
  });

  it("returns a message if there were no calls that required clearing", async () => {
    // Arrange
    const piiClearTime= new Date(moment(clearOutTime).subtract(30, "minutes"));
    newVisit = {
      ...newVisit,
      patientName: null,
      recipientEmail: null,
      recipientName: null,
      recipientNumber: null,
      pii_cleared_time: piiClearTime,
      status: statusToId(ARCHIVED),
    };

    const { departmentId } = await setupOrganisationFacilityDepartmentAndManager();
    await setUpScheduledCall({ ...newVisit, departmentId });

    // Act
    const deleteRecipientInformationForPii = deleteRecipientInformationForPiiGateway(container);
    const { success, message, error } = await deleteRecipientInformationForPii({ clearOutTime });

    // Assert
    expect(success).toBe(true);
    expect(message).toEqual("There were no calls that required recipient data clearing");
    expect(error).toBeNull();
  });

  it("catches errors",  async () => {
    // Arrange
    const { departmentId } = await setupOrganisationFacilityDepartmentAndManager();
    await setUpScheduledCall({ ...newVisit, departmentId });
    const invalidClearOutTime = "Invalid clear out time";

    // Act
    const deleteRecipientInformationForPii = deleteRecipientInformationForPiiGateway(container);
    const { success, message, error } = await deleteRecipientInformationForPii({ clearOutTime: invalidClearOutTime });
    
    // Assert
    expect(success).toBe(false);
    expect(message).toEqual("There was an error clearing recipient data for calls");
    expect(error).toEqual(
      "RequestError: Conversion failed when converting date and/or time from character string."
    );
  });
});