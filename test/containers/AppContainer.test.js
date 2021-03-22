import AppContainer from "../../src/containers/AppContainer";

describe("AppContainer", () => {
  let container;

  beforeEach(() => {
    process.env.GOVNOTIFY_API_KEY = "notify-api-key-meow";
    container = AppContainer.getInstance();
  });

  afterEach(() => {
    process.env.GOVNOTIFY_API_KEY = undefined;
  });

  it("provides a singleton", () => {
    const instance = AppContainer.getInstance();

    expect(instance).toBeDefined();

    const secondInstance = AppContainer.getInstance();

    expect(instance).toEqual(secondInstance);
  });

  it("returns getTokenProvider", () => {
    expect(container.getTokenProvider()).toBeDefined();
  });

  it("returns getUserIsAuthenticated", () => {
    expect(container.getUserIsAuthenticated()).toBeDefined();
  });

  it("returns getNotifyClient", () => {
    expect(container.getNotifyClient()).toBeDefined();
  });

  it("returns sendTextMessage", () => {
    expect(container.getSendTextMessage()).toBeDefined();
  });

  it("returns sendEmail", () => {
    expect(container.getSendEmail()).toBeDefined();
  });

  it("returns getRetrieveVisitByCallId", () => {
    expect(container.getRetrieveVisitByCallId()).toBeDefined();
  });

  it("returns verifyCallPassword", () => {
    expect(container.getVerifyCallPassword()).toBeDefined();
  });

  it("returns getValidateEmailAddress", () => {
    expect(container.getValidateEmailAddress()).toBeDefined();
  });

  it("returns getValidateMobileNumber", () => {
    expect(container.getValidateMobileNumber()).toBeDefined();
  });

  it("returns getCaptureEvent", () => {
    expect(container.getCaptureEvent()).toBeDefined();
  });

  it("returns getUpdateVisitById", () => {
    expect(container.getUpdateVisitById()).toBeDefined();
  });

  it("returns getSendBookingNotification", () => {
    expect(container.getSendBookingNotification()).toBeDefined();
  });

  it("returns getRetrieveVisitById", () => {
    expect(container.getRetrieveVisitById()).toBeDefined();
  });

  it("returns getRetrieveManagersByOrgId", () => {
    expect(container.getRetrieveManagersByOrgId()).toBeDefined();
  });

  it("returns getRetrieveManagersByOrgIdGateway", () => {
    expect(container.getRetrieveManagersByOrgIdGateway()).toBeDefined();
  });

  it("returns getRetrieveManagerByUuid", () => {
    expect(container.getRetrieveManagerByUuid()).toBeDefined();
  });

  it("returns getRetrieveManagerByUuidGateway", () => {
    expect(container.getRetrieveManagerByUuidGateway()).toBeDefined();
  });

  it("returns getUpdateManagerStatusByUuid", () => {
    expect(container.getUpdateManagerStatusByUuid()).toBeDefined();
  });

  it("returns getUpdateManagerStatusByUuidGateway", () => {
    expect(container.getUpdateManagerStatusByUuidGateway()).toBeDefined();
  });

  it("returns getArchiveManagerByUuid", () => {
    expect(container.getArchiveManagerByUuid()).toBeDefined();
  });

  it("returns getVerifyUserLogin", () => {
    expect(container.getVerifyUserLogin()).toBeDefined();
  });

  it("returns getResetPassword", () => {
    expect(container.getResetPassword()).toBeDefined();
  });

  it("returns getArchiveManagerByUuidGateway", () => {
    expect(container.getArchiveManagerByUuidGateway()).toBeDefined();
  });

  it("returns getDeleteVisitByCallIdGateway", () => {
    expect(container.getDeleteVisitByCallIdGateway()).toBeDefined();
  });

  it("returns getInsertVisitGateway", () => {
    expect(container.getInsertVisitGateway()).toBeDefined();
  });

  it("returns getLogEventGateway", () => {
    expect(container.getLogEventGateway()).toBeDefined();
  });

  it("returns getCaptureEventGateway", () => {
    expect(container.getCaptureEventGateway()).toBeDefined();
  });

  it("returns getRetrieveVisitByIdGateway", () => {
    expect(container.getRetrieveVisitByIdGateway()).toBeDefined();
  });

  it("returns getRetrieveOrganisationById", () => {
    expect(container.getRetrieveOrganisationById()).toBeDefined();
  });

  it("returns getRetrieveOrganisationByIdGateway", () => {
    expect(container.getRetrieveOrganisationByIdGateway()).toBeDefined();
  });

  it("returns getCreateFacilityGateway", () => {
    expect(container.getCreateFacilityGateway()).toBeDefined();
  });

  it("returns getCreateFacility", () => {
    expect(container.getCreateFacility()).toBeDefined();
  });

  it("returns getRetrieveFacilitiesByOrgIdGateway", () => {
    expect(container.getRetrieveFacilitiesByOrgIdGateway()).toBeDefined();
  });

  it("returns getRetrieveFacilitiesByOrgId", () => {
    expect(container.getRetrieveFacilitiesByOrgId()).toBeDefined();
  });

  it("returns getRetrieveFacilityByUuid", () => {
    expect(container.getRetrieveFacilityByUuid()).toBeDefined();
  });

  it("returns getRetrieveFacilityByUuidGateway", () => {
    expect(container.getRetrieveFacilityByUuidGateway()).toBeDefined();
  });

  it("returns getUpdateFacilityById", () => {
    expect(container.getUpdateFacilityById()).toBeDefined();
  });

  it("returns getUpdateFacilityByIdGateway", () => {
    expect(container.getUpdateFacilityByIdGateway()).toBeDefined();
  });

  it("returns getRetrieveActiveDepartmentsByFacilityId", () => {
    expect(container.getRetrieveActiveDepartmentsByFacilityId()).toBeDefined();
  });

  it("returns getRetrieveActiveDepartmentsByFacilityIdGateway", () => {
    expect(
      container.getRetrieveActiveDepartmentsByFacilityIdGateway()
    ).toBeDefined();
  });

  it("returns getCreateDepartment", () => {
    expect(container.getCreateDepartment()).toBeDefined();
  });

  it("returns getCreateDepartmentGateway", () => {
    expect(container.getCreateDepartmentGateway()).toBeDefined();
  });

  it("returns getRetrieveDepartmentByUuid", () => {
    expect(container.getRetrieveDepartmentByUuid()).toBeDefined();
  });

  it("returns getRetrieveDepartmentByUuidGateway", () => {
    expect(container.getRetrieveDepartmentByUuidGateway()).toBeDefined();
  });

  it("returns getUpdateDepartmentByIdGateway", () => {
    expect(container.getUpdateDepartmentByIdGateway()).toBeDefined();
  });

  it("returns getUpdateDepartmentById", () => {
    expect(container.getUpdateDepartmentById()).toBeDefined();
  });

  it("returns getArchiveDepartmentByIdGateway", () => {
    expect(container.getArchiveDepartmentByIdGateway()).toBeDefined();
  });

  it("returns getArchiveDepartmentById", () => {
    expect(container.getArchiveDepartmentById()).toBeDefined();
  });

  it(" returns getRetrieveDepartmentByCodeGateway", () => {
    expect(container.getRetrieveDepartmentByCodeGateway()).toBeDefined();
  });

  it("returns getRetrieveActiveDepartmentsByOrganisationIdGateway", () => {
    expect(
      container.getRetrieveActiveDepartmentsByOrganisationIdGateway()
    ).toBeDefined();
  });

  it("returns getCreateScheduledCallGateway", () => {
    expect(container.getCreateScheduledCallGateway()).toBeDefined();
  });

  it("returns getRetrieveActiveManagersByOrgIdGateway", () => {
    expect(container.getRetrieveActiveManagersByOrgIdGateway()).toBeDefined();
  });

  it("returns getRetrieveActiveManagersByOrgId", () => {
    expect(container.getRetrieveActiveManagersByOrgId()).toBeDefined();
  });

  it("returns getResetPassword", () => {
    expect(container.getResetPassword()).toBeDefined();
  });

  it("returns getResetPasswordGateway", () => {
    expect(container.getResetPasswordGateway()).toBeDefined();
  });

  it("returns getUpdateUserVerificationToVerified", () => {
    expect(container.getUpdateUserVerificationToVerified()).toBeDefined();
  });

  it("returns getUpdateUserVerificationToVerifiedGateway", () => {
    expect(container.getUpdateUserVerificationToVerifiedGateway()).toBeDefined();
  });

  it("returns getVerifyTimeSensitiveLink", () => {
    expect(container.getVerifyTimeSensitiveLink()).toBeDefined();
  });

  it("returns getVerifyTimeSensitiveLinkGateway", () => {
    expect(container.getVerifyTimeSensitiveLinkGateway()).toBeDefined();
  });

  it("returns getRetrieveTotalBookedVisitsForFacilitiesByOrgId", ()=>{
    expect(container.getRetrieveTotalBookedVisitsForFacilitiesByOrgId()).toBeDefined();
  })

  it("returns getRetrieveTotalBookedVisitsForFacilitiesByOrgIdGateway", ()=>{
    expect(container.getRetrieveTotalBookedVisitsForFacilitiesByOrgIdGateway()).toBeDefined();
  })

  it("returns getRetrieveTotalVisitsByStatusAndOrgId", ()=>{
    expect(container.getRetrieveTotalVisitsByStatusAndOrgId()).toBeDefined();
  })

  it("returns getRetrieveTotalVisitsByStatusAndOrgIdGateway", ()=>{
    expect(container.getRetrieveTotalVisitsByStatusAndOrgIdGateway()).toBeDefined();
  })

  it("returns getRetrieveTotalVisitsByStatusAndFacilityId", ()=>{
    expect(container.getRetrieveTotalVisitsByStatusAndFacilityId()).toBeDefined();
  })

  it("returns getRetrieveTotalVisitsByStatusAndFacilityIdGateway", ()=>{
    expect(container.getRetrieveTotalVisitsByStatusAndFacilityIdGateway()).toBeDefined();
  })

  it("returns getRetrieveTotalBookedVisitsForDepartmentsByFacilityId", ()=>{
    expect(container.getRetrieveTotalBookedVisitsForDepartmentsByFacilityId()).toBeDefined();
  })

  it("returns getRetrieveTotalBookedVisitsForDepartmentsByFacilityIdGateway", ()=>{
    expect(container.getRetrieveTotalBookedVisitsForDepartmentsByFacilityIdGateway()).toBeDefined();
  })

  it("returns getDeleteRecipientInformationForPii", () => {
    expect(container.getDeleteRecipientInformationForPii()).toBeDefined();
  });

  it("returns getDeleteRecipientInformationForPiiGateway", () => {
    expect(container.getDeleteRecipientInformationForPiiGateway()).toBeDefined();
  });

  it("returns getRetrieveTotalCompletedVisitsByOrgOrFacilityId", ()=>{
    expect(container.getRetrieveTotalCompletedVisitsByOrgOrFacilityId()).toBeDefined();
  });

  it("returns getRetrieveTotalCompletedVisitsByOrgOrFacilityIdGateway", ()=>{
    expect(container.getRetrieveTotalCompletedVisitsByOrgOrFacilityIdGateway()).toBeDefined();
  });

  it("returns getUpdateScheduledCallStartTimeByCallUuid", ()=>{
    expect(container.getUpdateScheduledCallStartTimeByCallUuid()).toBeDefined();
  });

  it("returns getUpdateScheduledCallStartTimeByCallUuidGateway", ()=>{
    expect(container.getUpdateScheduledCallStartTimeByCallUuidGateway()).toBeDefined();
  });
  
});
