import { NotifyClient } from "notifications-node-client";

const {
  NotifyClient: FakeNotifyClient,
} = require("../../../__mocks__/notifications-node-client");

export default (() => {
  let instance;

  return {
    getInstance: async () => {
      if (!instance) {
        const apiKey = process.env.API_KEY;

        if (process.env.APP_ENV === "test") {
          instance = new FakeNotifyClient(apiKey);
        } else {
          instance = new NotifyClient(apiKey);
        }

        delete instance.constructor;
      }

      return instance;
    },
  };
})();
