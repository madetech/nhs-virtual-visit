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
});
