import AppContainer from "./AppContainer";

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

  it("returns createVisit", () => {
    expect(container.getCreateVisit()).toBeDefined();
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

  it("returns getRetrieveSurveyUrlByCallId", () => {
    expect(container.getRetrieveSurveyUrlByCallId()).toBeDefined();
  });

  it("returns getRetrieveSupportUrlByCallId", () => {
    expect(container.getRetrieveSupportUrlByCallId()).toBeDefined();
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
});
