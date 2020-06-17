import { NotifyClient } from "notifications-node-client";
import GovNotify from "./";

const {
  NotifyClient: FakeNotifyClient,
} = require("../../../__mocks__/notifications-node-client");

describe("GovNotify", () => {
  it("Produces a singleton", () => {
    const instanceOne = GovNotify.getInstance();

    expect(instanceOne).toBeDefined();

    const instanceTwo = GovNotify.getInstance();

    expect(instanceOne).toEqual(instanceTwo);
  });

  describe("when using production environment", () => {
    it("returns the real Notify client", async () => {
      const instance = await GovNotify.getInstance();

      expect(instance).toBeInstanceOf(NotifyClient);
    });
  });

  describe("when using test environment", () => {
    beforeEach(() => {
      process.env.APP_ENV = "test";
    });

    afterEach(() => {
      process.env.APP_ENV = "";
    });

    it("returns the fake Notify client", async () => {
      const instance = await GovNotify.getInstance();

      expect(instance).toBeInstanceOf(FakeNotifyClient);
    });
  });
});
