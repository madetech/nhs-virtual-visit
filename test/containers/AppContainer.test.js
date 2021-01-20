import AppContainer from "../../src/containers/AppContainer";

describe("AppContainer", () => {
  let container;

  beforeEach(() => {
    process.env.API_KEY = "notify-api-key-meow";
    container = AppContainer.getInstance();
  });

  afterEach(() => {
    process.env.API_KEY = undefined;
  });

  it("provides a singleton", () => {
    const instance = AppContainer.getInstance();

    expect(instance).toBeDefined();

    const secondInstance = AppContainer.getInstance();

    expect(instance).toEqual(secondInstance);
  });

  it("returns getDb", async () => {
    expect(await container.getDb()).toBeDefined();
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

  it("returns createWard", () => {
    expect(container.getCreateWard()).toBeDefined();
  });

  it("returns getRetrieveVisitByCallId", () => {
    expect(container.getRetrieveVisitByCallId()).toBeDefined();
  });

  it("returns verifyCallPassword", () => {
    expect(container.getVerifyCallPassword()).toBeDefined();
  });

  it("returns getUpdateWard", () => {
    expect(container.getUpdateWard()).toBeDefined();
  });

  it("returns getVerifyWardCode", () => {
    expect(container.getVerifyWardCode()).toBeDefined();
  });

  it("returns getVerifyTrustAdminCode", () => {
    expect(container.getVerifyTrustAdminCode()).toBeDefined();
  });

  it("returns getRetrieveHospitalsByTrustId", () => {
    expect(container.getRetrieveHospitalsByTrustId()).toBeDefined();
  });

  it("returns getRetrieveTrustById", () => {
    expect(container.getRetrieveTrustById()).toBeDefined();
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

  it("returns getRetrieveAverageParticipantsInVisit", () => {
    expect(container.getRetrieveAverageParticipantsInVisit()).toBeDefined();
  });

  it("returns getRetrieveWardVisitTotalsStartDateByTrustId", () => {
    expect(
      container.getRetrieveWardVisitTotalsStartDateByTrustId()
    ).toBeDefined();
  });

  it("returns getRetrieveReportingStartDateByTrustId", () => {
    expect(container.getRetrieveReportingStartDateByTrustId()).toBeDefined();
  });

  it("returns getUpdateVisitById", () => {
    expect(container.getUpdateVisitById()).toBeDefined();
  });

  it("returns getSendBookingNotification", () => {
    expect(container.getSendBookingNotification()).toBeDefined();
  });

  it("returns getCreateTrustGateway", () => {
    expect(container.getCreateTrustGateway()).toBeDefined();
  });

  it("returns getCreateWardGateway", () => {
    expect(container.getCreateWardGateway()).toBeDefined();
  });

  it("returns getUpdateTrustGateway", () => {
    expect(container.getUpdateTrustGateway()).toBeDefined();
  });

  it("returns getUpdateWardGateway", () => {
    expect(container.getUpdateWardGateway()).toBeDefined();
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

  it("returns getRetrieveEmailAndHashedPassword", () => {
    expect(container.getRetrieveEmailAndHashedPassword()).toBeDefined();
  });

  it("returns getResetPassword", () => {
    expect(container.getResetPassword()).toBeDefined();
  });

  it("returns getVerifyResetPasswordLink", () => {
    expect(container.getVerifyResetPasswordLink()).toBeDefined();
  });

  it("returns getArchiveManagerByUuidGateway", () => {
    expect(container.getArchiveManagerByUuidGateway()).toBeDefined();
  });

  it("returns getFindWardByCodeGateway", () => {
    expect(container.getFindWardByCodeGateway()).toBeDefined();
  });

  it("returns getUpdateCallStatusesByWardIdGateway", () => {
    expect(container.getUpdateCallStatusesByWardIdGateway()).toBeDefined();
  });

  it("returns getUpdateWardArchiveTimeByIdGateway", () => {
    expect(container.getUpdateWardArchiveTimeByIdGateway()).toBeDefined();
  });

  it("returns getRetrieveHospitalVisitTotalsGateway", () => {
    expect(container.getRetrieveHospitalVisitTotalsGateway()).toBeDefined();
  });

  it("returns getRetrieveAverageParticipantsInVisitGateway", () => {
    expect(
      container.getRetrieveAverageParticipantsInVisitGateway()
    ).toBeDefined();
  });

  it("returns getRetrieveWardsByHospitalIdGateway", () => {
    expect(container.getRetrieveWardsByHospitalIdGateway()).toBeDefined();
  });

  it("returns getMarkVisitAsCompleteGateway", () => {
    expect(container.getMarkVisitAsCompleteGateway()).toBeDefined();
  });

  it("returns getDeleteVisitByCallIdGateway", () => {
    expect(container.getDeleteVisitByCallIdGateway()).toBeDefined();
  });

  it("returns getCreateOrganizationGateway", () => {
    expect(container.getCreateOrganizationGateway()).toBeDefined();
  });

  it("returns getInsertVisitGateway", () => {
    expect(container.getInsertVisitGateway()).toBeDefined();
  });

  it("returns getUpdateHospitalGateway", () => {
    expect(container.getUpdateHospitalGateway()).toBeDefined();
  });

  it("returns getRetrieveHospitalByIdGateway", () => {
    expect(container.getRetrieveHospitalByIdGateway()).toBeDefined();
  });

  it("returns getRetrieveHospitalsByTrustIdGateway", () => {
    expect(container.getRetrieveHospitalsByTrustIdGateway()).toBeDefined();
  });

  it("returns getRetrieveWardVisitTotalsGateway", () => {
    expect(container.getRetrieveWardVisitTotalsGateway()).toBeDefined();
  });

  it("returns getRetrieveAverageVisitTimeByTrustIdGateway", () => {
    expect(
      container.getRetrieveAverageVisitTimeByTrustIdGateway()
    ).toBeDefined();
  });

  it("returns getInsertHospitalGateway", () => {
    expect(container.getInsertHospitalGateway()).toBeDefined();
  });

  it("returns getUpdateWardVisitTotalsGateway", () => {
    expect(container.getUpdateWardVisitTotalsGateway()).toBeDefined();
  });

  it("returns getRetrieveHospitalWardVisitTotalsGateway", () => {
    expect(container.getRetrieveHospitalWardVisitTotalsGateway()).toBeDefined();
  });

  it("returns getRetrieveAverageVisitsPerDayGateway", () => {
    expect(container.getRetrieveAverageVisitsPerDayGateway()).toBeDefined();
  });

  it("returns getRetrieveTrustsGateway", () => {
    expect(container.getRetrieveTrustsGateway()).toBeDefined();
  });

  it("returns getLogEventGateway", () => {
    expect(container.getLogEventGateway()).toBeDefined();
  });

  it("returns getRetrieveReportingStartDateByTrustIdGateway", () => {
    expect(
      container.getRetrieveReportingStartDateByTrustIdGateway()
    ).toBeDefined();
  });
});
