import AppContainer from "./AppContainer";

describe("AppContainer", () => {
  let container;

  beforeEach(() => {
    process.env.API_KEY = "notify-api-key-meow";
    container = new AppContainer();
  });

  afterEach(() => {
    process.env.API_KEY = undefined;
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
});
